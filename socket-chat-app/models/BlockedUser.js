const mongoose = require('mongoose');

const BlockedUserSchema = new mongoose.Schema({
    blocker: String,   // User who is blocking
    blocked: String    // User who is blocked
});

module.exports = mongoose.model('BlockedUser', BlockedUserSchema);
