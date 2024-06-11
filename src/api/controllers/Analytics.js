const ChatModel = require('../../models/Chat');

class SessionController {
    async activeUser(req, res) {
        const activeUsersCount = WebSocketServer.getActiveUsersCount();
        res.json({ activeUsersCount });
    }

    async messageFrequencies(req, res) {
        try {
            const messageFrequencies = WebSocketServer.getMessageFrequencies();
            res.json({ messageFrequencies });
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

    async typicalSessionDuration(req, res) {
        const { id } = req.body;
        try {
            const typicalSessionDuration = WebSocketServer.getTypicalSessionDuration();
            res.json({ typicalSessionDuration });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new SessionController();
