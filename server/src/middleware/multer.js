import multer from "multer";
import path from "path";

const profileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueName = Date.now();
    cb(null, uniqueName + extname);
  },
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/profile");
  },
});

const messageStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueName = Date.now();
    cb(null, uniqueName + extname);
  },
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/message");
  },
});

export const profileUpload = multer({ storage: profileStorage });
export const messageUpload = multer({ storage: messageStorage });
