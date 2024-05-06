var express = require('express');
var controller = require('../controllers/index')
var router = express.Router();
router.post('/send',controller.message.send_message);
router.get('/get',controller.message.getMessages)
module.exports = router;
