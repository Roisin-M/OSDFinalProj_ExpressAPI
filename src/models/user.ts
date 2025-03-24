import {ObjectId} from "mongodb";
import Joi from "joi";

export default interface User{
    name: string;
    phonenumber: string;
    email: string;
    id?: ObjectId;
    password?: string;
    hashedPassword?: string;
    classIds?: ObjectId[]; // Array of Class IDs (references to classes) for many-to many relationship
}

export const ValidateUser = (user: User)=>{
    const userJoiSchema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phonenumber: Joi.string().min(10),
    email: Joi.string().email().required(),
    classIds: Joi.array()
        .items(
            Joi.string()
            .custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.error("invalid.classId", { value });
          }
          return value;
        }))
        .optional(), // classIds is optional, but must contain valid ObjectId strings
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