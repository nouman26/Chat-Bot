const WebSocket = require('ws');
const ChatModel = require('../models/Chat');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require("node-cache");
const cache = new NodeCache();

// Example function to fetch data from the database
const fetchDataFromDatabase = async () => {
    try {
        // Perform database query
        const data = await ChatModel.find({}).lean().exec(); // Using lean() for faster query execution
        return data;
    } catch (error) {
        console.error("Error fetching data from database:", error);
        return null;
    }
};

class WebSocketServer {
    constructor(port) {
        this.wss = new WebSocket.Server({ port });
        this.sessions = new Map();
        this.activeUsers = new Set(); // Track active users
        this.messageFrequencies = {}; // Track message frequencies
        this.sessionStartTimes = {}; // Track session start times
        this.initialize();
    }

    initialize() {
        this.fetchDataFromDB();
        this.wss.on('connection', (ws, req) => {
            // const token = req.url.split('token=')[1];
            // if (!token) {
            //     ws.close(1008, 'Authentication required');
            //     return;
            // }

            // let decoded;
            // try {
            //     decoded = jwt.verify(token, JWT_SECRET);
            // } catch (err) {
            //     ws.close(1008, 'Invalid token');
            //     return;
            // }
            const sessionId = uuidv4();
            this.sessions.set(sessionId, ws);
            this.activeUsers.add(sessionId); // Add user to active users set
            this.sessionStartTimes[sessionId] = Date.now(); // Record session start time

            ws.on('message', (message) => this.handleMessage(sessionId, message));
            ws.on('close', () => {
                this.sessions.delete(sessionId);
                this.activeUsers.delete(sessionId); // Remove user from active users set
                delete this.sessionStartTimes[sessionId]; // Delete session start time
            });
        });
    }

    handleMessage(sessionId, message) {
        console.log(`Received message from ${sessionId}: ${message}`);
        const response = `Echo: ${message}`;
        const ws = this.sessions.get(sessionId);
        if (ws) {
            ws.send(response);
            // Update message frequencies
            if (!this.messageFrequencies[sessionId]) {
                this.messageFrequencies[sessionId] = 1;
            } else {
                this.messageFrequencies[sessionId]++;
            }
        }
    }

    getActiveUsersCount() {
        return this.activeUsers.size;
    }

    getMessageFrequencies() {
        return this.messageFrequencies;
    }

    getTypicalSessionDuration() {
        const sessionStartTimesArray = Object.values(this.sessionStartTimes);
        const currentTime = Date.now();
        const sessionDurations = sessionStartTimesArray.map(startTime => (currentTime - startTime) / 1000); // Convert to seconds
        const totalSessions = sessionDurations.length;
        const totalDuration = sessionDurations.reduce((acc, duration) => acc + duration, 0);
        const typicalDuration = totalDuration / totalSessions;
        return typicalDuration;
    }

    fetchDataFromDB() {
        const cachedData = cache.get("cachedData");
        if (cachedData) {
            return cachedData;
        } else {
            // Fetch data from the database
            const data = fetchDataFromDatabase();
            cache.set("cachedData", data, 60); // Cache data for 60 seconds
            return data;
        }
    }
}

module.exports = WebSocketServer;