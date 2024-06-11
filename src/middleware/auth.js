const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sadasd sadasdas asdas';

function authenticate(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        // const verified = jwt.verify(token, JWT_SECRET);
        // req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
}

module.exports = authenticate;