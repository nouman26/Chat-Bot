var express = require("express");
var router = express.Router();

router.use("/session", require("./services/Session"));
router.use("/analytics", require("./services/Analytics"));

module.exports = router;