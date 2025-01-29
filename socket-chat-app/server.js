const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize the app and the server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store users and their socket IDs
let users = {};

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// When a user connects to the server
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Listen for a 'set username' event to associate a username with the socket
    socket.on('set username', (username) => {
        users[username] = socket.id; // Map username to socket.id
        console.log(`User ${username} connected with socket ID ${socket.id}`);
    });

    // Listen for private messages
    socket.on('private message', (data) => {
        const { to, message } = data;
        const recipientSocketId = users[to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', {
                from: socket.id,
                message: message
            });
            console.log(`Private message from ${socket.id} to ${to}`);
        } else {
            console.log(`User ${to} not found`);
        }
    });

    // When the user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        // Remove user from the users map when they disconnect
        for (const [username, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[username];
                console.log(`User ${username} disconnected`);
                break;
            }
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

