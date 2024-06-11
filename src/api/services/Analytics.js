var express = require("express");
var router = express.Router();
const controllers = require("../controllers");
const authenticate = require('../../middleware/auth');

router.get('/active/user', authenticate, controllers.Analytics.activeUser);
router.get('/message/frequencies', authenticate, controllers.Analytics.messageFrequencies);
router.get('/session/history', authenticate, controllers.Analytics.getSessionHistory);
router.get('/typical/session/duration', authenticate, controllers.Analytics.typicalSessionDuration);

module.exports = router;