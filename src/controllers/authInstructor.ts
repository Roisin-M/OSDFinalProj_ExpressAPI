import { Request, Response } from 'express';
import { instructorsCollection } from "../database";
import * as argon2 from 'argon2';
import {sign as jwtSign, verify as jwtVerify} from 'jsonwebtoken';
import Instructor from '../models/instructor';

export const handleInstructorLogin = async (req: Request, res: Response): Promise<any> => {

    const email = req.body?.email
    
    const password = req.body?.password
  
    if (!email || !password) {
       res
        .status(400)
        .json({ message: 'Email and password are required' });
        return;
    }
      const instructor = await instructorsCollection.findOne({
        email: email.toLowerCase(),
      })
  
      const dummyPassword = 'dummy_password';
      const dummyHash = await argon2.hash(dummyPassword);
    
      // Use the user's hash if found, otherwise use the dummy hash
      let instructorPasswordHash;

      if (instructor && instructor.hashedPassword){
       instructorPasswordHash =  instructor.hashedPassword;
      }
      else{
         instructorPasswordHash = dummyHash;
      }
    
      // check password
        const isPasswordValid = await argon2.verify(instructorPasswordHash, password);
  
        // If password is invalid, return unauthorized
        if (!isPasswordValid) {
         res.status(401).json({
            message: 'Invalid email or password!'
          });
          return;
        }

        if (!instructor || !instructor.name || !instructor.email || !instructor._id) {
          return res.status(500).json({ message: 'User data is incomplete or invalid' });
        }

          // Construct token-safe payload
          const instructorPayload = {
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
          };

        const accessToken = createAccessToken(instructorPayload);

        return res.status(201).json({ accessToken });

      }

    export const handleInstructorLogout = async (req: Request, res: Response)=>{
        console.log("logout request received");

        //handled in client
        res.status(200)
        .json({message: 'logout succesful'});
    };

const createAccessToken = (instructor: Instructor | null) : string  => {

    const secret = process.env.JWTSECRET || "not very secret";
    const expiresTime = process.env.JWTEXPIRES || 60;
    console.log(expiresTime);
    const payload =
    {
        _id: instructor?.id, //include id to allow fetching of current id in angular app
        email: instructor?.email,
        name: instructor?.name,
        role: instructor?.role || 'instructor'
    }
    const token = jwtSign(payload, secret, {expiresIn: parseInt(expiresTime.toString())}); 

    return token;

}

