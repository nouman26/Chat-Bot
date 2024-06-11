const express = require('express');
const mongoose = require('mongoose');
const apis = require('./api');
const rateLimit = require('express-rate-limit');

mongoose.connect('mongodb://localhost:27017/chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use("/api", apis);

module.exports = app;