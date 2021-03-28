const express = require('express'),
  router = express.Router(),
  asyncMiddleware = require('express-async-handler'),
  userCtrl = require('../controllers/UserController');

//-------------------------------Product Routes-----------------------------------
router.post('/signUp', asyncMiddleware(userCtrl.createUser));
router.post('/signIn', asyncMiddleware(userCtrl.signIn));
router.get('/verifyToken', asyncMiddleware(userCtrl.verifyToken));
router.get('/getUser',asyncMiddleware(userCtrl.getUser));

module.exports = router;
