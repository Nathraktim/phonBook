const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDirectory = path.join(__dirname, '../../server/data/contactImg/');

if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
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
        const fileExtension = path.extname(file.originalname); // Get the file extension
        cb(null, `photo${nextPhotoNumber}${fileExtension}`); // Add the extension to the filename
      });
    }
  });
  
  const imgUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('photo');

module.exports = imgUpload;