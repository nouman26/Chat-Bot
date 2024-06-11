var express = require("express");
var router = express.Router();
const controllers = require("../controllers");
const authenticate = require('../../middleware/auth');

router.post('/start', authenticate, controllers.Session.startSession);
router.post('/message', authenticate, controllers.Session.handleMessage);
router.get('/:id/history', authenticate, controllers.Session.getSessionHistory);
router.post('/end', authenticate, controllers.Session.endSession);

module.exports = router;