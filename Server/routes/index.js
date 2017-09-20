var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var status = require('./status.js');
var register = require('./register.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register',register.signup);
/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/status', status.getAll);
router.get('/api/status/:date', status.getByDate);
router.get('/api/status/:date/:userid', status.getByDateUser);
router.post('/api/status', status.updateStatusByUser);
module.exports = router;