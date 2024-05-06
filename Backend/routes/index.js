var express = require('express');
var user = require('./users')
const auth = require('../middleware/passport')
var message = require('../routes/message')
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/user',user)
router.use('/message',auth.authenticate('jwt',{session : false}),message)
module.exports = router;
