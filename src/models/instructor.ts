import { ObjectId } from "mongodb";
import Joi from "joi";

// Define YogaSpeciality as an Enum
export enum YogaSpeciality {
  Hatha = 'Hatha',
  Vinyasa = 'Vinyasa',
  Ashtanga = 'Ashtanga',
  Bikram = 'Bikram',
  Iyengar = 'Iyengar',
  Kundalini = 'Kundalini',
  Yin = 'Yin',
  Restorative = 'Restorative',
  PowerYoga = 'Power Yoga',
  Jivamukti = 'Jivamukti',
  Anusara = 'Anusara',
  Sivananda = 'Sivananda',
  Prenatal = 'Prenatal',
  AerialYoga = 'Aerial Yoga',
  AcroYoga = 'AcroYoga',
  ChairYoga = 'Chair Yoga',
  Viniyoga = 'Viniyoga',
  YogaNidra = 'Yoga Nidra',
  IntegralYoga = 'Integral Yoga',
  TantraYoga = 'Tantra Yoga'
}

export default interface Instructor {
  name: string;
  yogaSpecialities?: YogaSpeciality[]; 
  email: string;
  id?: ObjectId;
  password?: string;
  hashedPassword?: string;
  role?: 'instructor';
  classIds?: ObjectId[];
}

// Joi validation schema
const yogaSpecialityValues = Object.values(YogaSpeciality);

export const ValidateInstructor = (instructor: Instructor) => {
  const instructorJoiSchema = Joi.object<Instructor>({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    yogaSpecialities: Joi.array()
      .items(Joi.string().valid(...yogaSpecialityValues))
      .min(1)
      .required(),
    password: Joi.string()
      .min(8)
      .max(64)
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*).",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must not exceed 64 characters.",
        "string.empty": "Password is required.",
      }),
    classIds: Joi.array()
      .items(
        Joi.string().custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.error("invalid.classId", { value });
          }
          return value;
        })
      )
      .optional(),
    role: Joi.string().valid("instructor").optional()
  }).required();

  return instructorJoiSchema.validate(instructor, { abortEarly: false });
};
