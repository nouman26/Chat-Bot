const ChatModel = require('../../models/Chat');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class SessionController {
    async startSession(req, res) {
        const sessionId = uuidv4();
        res.json({ sessionId });
    }

    async handleMessage(req, res) {
        const { message } = req.body;
        const response = `Echo: ${message}`;
        
        try {
            const chat = new ChatModel({
                message,
                response,
                sessionId: req.sessionId
            });
            await chat.save();
            res.json({ response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getSessionHistory(req, res) {
        const { id } = req.params;
        try {
            const history = await ChatModel.find({ sessionId: id });
            res.json({ history });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async endSession(req, res) {
        const { id } = req.body;
        try {
            await ChatModel.deleteMany({ sessionId: id });
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async handleThirdPartyServiceIntegration(req, res) {
        try {
            // Make a request to the third-party API
            const response = await axios.get('third-party-api-url');
            const responseData = response.data;
            // Process the response and incorporate it into chat responses
            const enrichedResponse = `Third-Party Data: ${responseData}`;
            res.json({ response: enrichedResponse });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error integrating with third-party service' });
        }
    }
}

module.exports = new SessionController();
