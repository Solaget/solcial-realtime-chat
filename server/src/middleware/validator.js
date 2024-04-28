import Joi from "joi";
import { signupSchema } from "../validator/signupValidator.js";

// Signup Middleware
export function validateSignup(req, res, next) {
  const { error } = Joi.validate(req.body, signupSchema);
  if (error) {
    console.log(error);
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
}
