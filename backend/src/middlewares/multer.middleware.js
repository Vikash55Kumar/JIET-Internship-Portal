import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Absolute Path Logic (VM Safe)
const uploadDir = path.join(process.cwd(), "public", "temp");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 2. Production: Unique filenames to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Replace spaces in filenames with hyphens to avoid URL issues
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

// 3. Production: Security Limits
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // Limit file size to 1MB
  },
  fileFilter: (req, file, cb) => {
    // Restrict to PDF and DOC/DOCX only
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  }
});
