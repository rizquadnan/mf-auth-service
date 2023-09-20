import { Joi } from 'express-validation';

export const registerValidation = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.string().required()
})