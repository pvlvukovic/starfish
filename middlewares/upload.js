// upload middleware

// imports
const multer = require("multer");
const path = require("path");

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set destination
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    // get file extension
    const ext = path.extname(file.originalname);
    // generate random file name
    cb(null, Date.now() + ext);
  },
});

// create upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

// export upload middleware
module.exports = upload;
