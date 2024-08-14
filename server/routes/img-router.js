// @/api/images/:id
const express = require('express');
const protect = require('../middleware/auth-middleware');
const { img }= require('../controller/img-controller');

const imgRouter = express.Router();
imgRouter.get('/:id', protect, img);

module.exports = { imgRouter }

//i have added this route to get the contact image easily, this is also protected.