const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const verifyJWT = require('../middleware/verifyjwt');

    router.route('/login')
     //.get()
     .post(userController.handleLogin);

    router.route('/logout')
    .post(userController.handleLogout);

    router.route('/users')
    .post(userController.handleNewUser);

     router.route('/users/:userId')
     .put(verifyJWT, userController.handleUserAlteration)
     .get(userController.showUserInfo)
     .delete(verifyJWT, userController.handleUserDeletion);
module.exports = router;