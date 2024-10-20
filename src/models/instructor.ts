import {ObjectId} from "mongodb";
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

export default interface Instructor{
    name: string;
    yogaSpecialities :YogaSpeciality[];
    email:string;
    id?: ObjectId;
}

// create an array of valid values from YogaSpeciality enum
const yogaSpecialityValues = Object.values(YogaSpeciality);

// Joi validation schema for Instructor
export const ValidateInstructor = (instructor: Instructor) => {
  const instructorJoiSchema = Joi.object<Instructor>({
      name: Joi.string().min(3).required(), // Name must be at least 3 characters and required
      yogaSpecialities: Joi.array()
          .items(
              Joi.string().valid(...yogaSpecialityValues)
          )
          .min(1)
          .required(), // Must have at least 1 yoga speciality and required
      email: Joi.string().email().required() // Email must be valid and required
  });

  return instructorJoiSchema.validate(instructor);
};