import {ObjectId} from "mongodb";
import Joi from "joi";

export default interface User{
    name: string;
    phonenumber: string;
    email: string;
    id?: ObjectId;
    password?: string;
    hashedPassword?: string;
}

export const ValidateUser = (user: User)=>{
    const userJoiSchema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phonenumber: Joi.string().min(10),
    email: Joi.string().email().required(),
    password: Joi.string()
    .min(8)
    .max(64)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.pattern.base": 
          "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*).",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must not exceed 64 characters.",
        "string.empty": "Password is required.",
    }),
    }).required(); 
    return userJoiSchema.validate(user, { abortEarly: false });
  //all joi validation errors are displayed instead of stopping and displaying just the first one
}