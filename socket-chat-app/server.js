const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('your_mongodb_atlas_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

let users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('set username', (username) => {
        users[username] = socket.id;
        console.log(`User ${username} connected with socket ID ${socket.id}`);
    });

    socket.on('private message', async (data) => {
        const { sender, recipient, message } = data;
        
        const newMessage = new Message({ sender, recipient, message });
        await newMessage.save(); // Store in MongoDB
        
        const recipientSocketId = users[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', { from: sender, message });
        }
    });

    socket.on('fetch messages', async (username) => {
        const messages = await Message.find({
            $or: [{ sender: username }, { recipient: username }]
        }).sort({ timestamp: 1 });

        socket.emit('chat history', messages);
    });

    socket.on('disconnect', () => {
        for (const [username, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[username];
                console.log(`User ${username} disconnected`);
                break;
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
