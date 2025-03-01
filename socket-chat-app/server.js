const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const BlockedUser = require('./models/BlockedUser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb+srv://vijjijayasurya:qXKbVctNcmajYWX1@storyvaultcluster.bn3xu.mongodb.net/storyvault', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


let users = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('set username', (username) => {
        users[username] = socket.id;
        console.log(`User ${username} connected with socket ID ${socket.id}`);
    });

    socket.on('block user', async ({ blocker, blocked }) => {
        const existingBlock = await BlockedUser.findOne({ blocker, blocked });
        if (!existingBlock) {
            const newBlock = new BlockedUser({ blocker, blocked });
            await newBlock.save();
            console.log(`${blocker} blocked ${blocked}`);
        }
    });

    socket.on('private message', async (data) => {
        const { to, message, from } = data;
        
        const isBlocked = await BlockedUser.findOne({ blocker: to, blocked: from });
        if (isBlocked) {
            console.log(`Message from ${from} to ${to} blocked.`);
            return;
        }

        const recipientSocketId = users[to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', { from, message });
            console.log(`Private message from ${from} to ${to}`);
            
            const newMessage = new Message({ sender: from, recipient: to, message });
            await newMessage.save();
        } else {
            console.log(`User ${to} not found`);
        }
    });

    socket.on('delete message', async (data) => {
        const { messageId, username, deleteForAll } = data;
    
        const msg = await Message.findById(messageId);
        if (!msg) return;
    
        if (deleteForAll) {
            await Message.findByIdAndDelete(messageId);
            io.emit('message deleted', { messageId });
        } else {
            if (!msg.deletedFor.includes(username)) {
                msg.deletedFor.push(username);
                await msg.save();
            }
            io.to(socket.id).emit('message deleted', { messageId });
        }
    });
    

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        for (const [username, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[username];
                console.log(`User ${username} disconnected`);
                break;
            }
        }
    });

    socket.on('set username', async (username) => {
        users[username] = socket.id;
        console.log(`User ${username} connected with socket ID ${socket.id}`);
    
        try {
            const messageHistory = await Message.find({
                $or: [{ sender: username }, { recipient: username }]
            }).sort({ timestamp: 1 });
    
            io.to(socket.id).emit('message history', messageHistory);
        } catch (err) {
            console.error('Error fetching message history:', err);
        }
    });
    
    socket.on('unblock user', async (data) => {
        const { requester, target } = data;
    
        try {
            await BlockedUser.deleteOne({ blocker: requester, blocked: target });
            console.log(`${requester} unblocked ${target}`);
            io.to(users[requester]).emit('user unblocked', { target });
        } catch (err) {
            console.error('Error unblocking user:', err);
        }
    });
    
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
