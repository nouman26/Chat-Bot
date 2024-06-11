const app = require('./app');
const WebSocketServer = require('./sockets/WebSocketServer');

const PORT = process.env.PORT || 3000;
const WSPORT = process.env.WSPORT || 8080;

app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
});

const wsServer = new WebSocketServer(Number(WSPORT));
console.log(`WebSocket Server is running on port ${WSPORT}`);
