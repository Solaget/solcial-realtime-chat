import Joi from "joi";

export const signupSchema = Joi.object({
  fullName: Joi.string().required().min(1).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const passwordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});
export const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});