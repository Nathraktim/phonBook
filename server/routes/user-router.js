// @/api/auth
const express = require('express');
const {registerUser, loginUser} = require('../controller/user-controller.js');

const userRouter = express.Router();
userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);

module.exports = userRouter;