import multer from "multer";
import path from "path";
import fs from "fs";

// Directory to store the uploaded files temporarily
const tempDir = path.resolve("./public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer storage configuration for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Save the file in the temp directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  },
});

// Multer middleware to accept a single file upload
const upload = multer({
  storage,
}).single("document"); // Accept only one file with the field name 'document'

export { upload };


