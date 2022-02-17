// upload middleware
// uses multer to upload files to s3
// use multer-s3

// imports
const multer = require("multer");

// file mime types
// allow images and videos
const fileMimeTypes = [
  "image/jpg",
  "image/JPG",
  "image/jpeg",
  "image/JPEG",
  "image/png",
  "image/PNG",
  "video/mp4",
  "video/MP4",
  "video/mov",
  "video/MOV",
  "video/avi",
  "video/AVI",
];

// configure multer
const upload = multer({
  fileFilter: (req, file, cb) => {
    // allow only images and videos
    if (fileMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    }
    cb(null, false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  storage: multer.memoryStorage(),
});

// export
module.exports = upload;
