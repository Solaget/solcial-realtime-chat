import { messageUpload } from "./multer.js";

const messageMiddleware = (req, res, next) => {
  const contentType = req.headers["content-type"];
  //   Check incoming req data is from data
  if (!contentType?.includes("multipart/form-data")) {
    next();
    return;
  }

  req.withFile = true;
  messageUpload.single("file")(req, res, next);
};

export default messageMiddleware;
