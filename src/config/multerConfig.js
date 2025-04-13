import multer from "multer";

// Setup the Multer upload configuration
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Not an image! Please upload an image file."));
    }
  },
});

export default upload;
