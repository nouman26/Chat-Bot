const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        index: true
    },
    response: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
