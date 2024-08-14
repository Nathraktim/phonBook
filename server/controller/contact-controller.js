// contact-controller.js
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const multer = require('multer');

const contactsFilePath = path.join(__dirname, '../data/contacts.json');

const getAllContacts = async (req, res) => {
  const userId = req.user.id;

  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading contacts file' });
    }

    let contacts = [];

    if (data) {
      contacts = JSON.parse(data);
    }

    const userContacts = contacts.filter(contact => contact.userId === userId);

    res.status(200).json(userContacts);
  });
};

const getOneContact = async (req, res) => {

  const userId = req.user.id;
  const contactId = parseInt(req.params.id, 10);


  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading contacts file' });
    }

    let contacts = [];

    if (data) {
      contacts = JSON.parse(data);
    }

    const contact = contacts.find(contact => contact.id === contactId && contact.userId === userId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    res.status(200).json(contact);
  });
};

const uploadsDirectory = path.join(__dirname, '../uploads');
const readContactsFromFile = () => {
  if (fs.existsSync(contactsFilePath)) {
    const data = fs.readFileSync(contactsFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const writeContactsToFile = (contacts) => {
  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    fs.readdir(uploadsDirectory, (err, files) => {
      if (err) {
        return cb(err);
      }
      const nextPhotoNumber = files.length + 1;
      cb(null, `photo${nextPhotoNumber}${path.extname(file.originalname)}`);
    });
  }
});

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
});

const createContact = async (req, res) => {
  const { error } = contactSchema.validate({ name: req.body.name, email: req.body.email, phone: req.body.phone });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  };

  const { name, email, phone } = req.body;
  const userId = req.user.id;
  let contacts = readContactsFromFile();
  const photoLink = req.file ? req.file.filename : 'photo.png';
  const nextContactId = contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1;
  const newContact = {
    id: nextContactId,
    userId,
    name,
    email,
    phone,
    photoLink
  };
  contacts.push(newContact);
  writeContactsToFile(contacts);

  res.status(201).json(newContact);
};

const updateContactSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(10).max(15).optional(),
  photoLink: Joi.string().optional()
});
const updateContact = async (req, res) => {
  const userId = req.user.id;
  const contactId = parseInt(req.params.id, 10);
  const updates = req.body; // Updates from the request body

  // Validate the updates
  const { error } = updateContactSchema.validate(updates);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }


  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading contacts file' });
    }

    let contacts = [];

    if (data) {
      contacts = JSON.parse(data);
    }

    // Find the contact by ID and ensure it belongs to the logged-in user
    const contactIndex = contacts.findIndex(contact => contact.id === contactId && contact.userId === userId);

    if (contactIndex === -1) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    // Update the contact
    contacts[contactIndex] = { ...contacts[contactIndex], ...updates };

    // Save the updated contacts to the file
    fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating contacts file' });
      }

      // Send the updated contact as the response
      res.status(200).json(contacts[contactIndex]);
    });
  });
};

const deleteOneContact = async (req, res) => {
  const userId = req.user.id;
  const contactId = parseInt(req.params.id, 10);

  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading contacts file' });
    }

    let contacts = [];

    if (data) {
      contacts = JSON.parse(data);
    }

    const contactIndex = contacts.findIndex(contact => contact.id === contactId && contact.userId === userId);

    if (contactIndex === -1) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    contacts.splice(contactIndex, 1);

    fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating contacts file' });
      }
      res.status(200).json({ message: 'Contact deleted successfully' });
    });
  });
};

const deleteAllContact = async (req, res) => {
  const userId = req.user.id;

  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading contacts file' });
    }

    let contacts = [];

    if (data) {
      contacts = JSON.parse(data);
    }

    const remainingContacts = contacts.filter(contact => contact.userId !== userId);

    if (remainingContacts.length === contacts.length) {
      return res.status(404).json({ message: 'No contacts found for the user' });
    }

    fs.writeFile(contactsFilePath, JSON.stringify(remainingContacts, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating contacts file' });
      }

      res.status(200).json({ message: 'All contacts deleted successfully' });
    });
  });
};

module.exports = {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteOneContact,
  deleteAllContact
}