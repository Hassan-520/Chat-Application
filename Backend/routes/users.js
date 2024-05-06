var express = require('express');
var router = express.Router();
var controller = require('../controllers/index')
var {upload} = require('../middleware/profilemiddleware')
router.post('/register',controller.user.register_user)
router.post('/login',controller.user.login_user)
router.put('/edit/:id',controller.user.edit_user)
router.put('/uploadprofile/:id', upload.single('profileImage'),controller.user.upload_profile)
module.exports = router;
