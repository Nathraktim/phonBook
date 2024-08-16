// @/api/contact
const express = require('express');
const { getAllContacts, getOneContact, createContact, updateContact, deleteOneContact, deleteAllContact } = require('../controller/contact-controller.js');
const protect = require('../middleware/auth-middleware');
const imgUpload = require('../middleware/contact-middleware');

const contactRouter = express.Router();
contactRouter.get('/', protect, getAllContacts );
contactRouter.get('/:id', protect, getOneContact);
contactRouter.post('/', protect, imgUpload, createContact);
contactRouter.put('/:id', protect, imgUpload, updateContact);
contactRouter.delete('/:id', protect, deleteOneContact);
contactRouter.delete('/', protect, deleteAllContact);

module.exports = contactRouter;