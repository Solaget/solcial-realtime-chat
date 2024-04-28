import jwt from "jsonwebtoken";

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload , process.env._JWT_SECRETKEY, {
    expiresIn: expiresIn || "30d",
  });
};

export default generateToken;
