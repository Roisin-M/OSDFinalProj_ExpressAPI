import { Request, Response } from 'express';
import { usersCollection } from "../database";
import * as argon2 from 'argon2';
import {sign as jwtSign, verify as jwtVerify} from 'jsonwebtoken';
import User  from '../models/user';

export const handleLogin = async (req: Request, res: Response): Promise<any> => {

    const email = req.body?.email
    
    const password = req.body?.password
  
    if (!email || !password) {
       res
        .status(400)
        .json({ message: 'Email and password are required' });
        return;
    }
      const user = await usersCollection.findOne({
        email: email.toLowerCase(),
      })
  
      const dummyPassword = 'dummy_password';
      const dummyHash = await argon2.hash(dummyPassword);
    
      // Use the user's hash if found, otherwise use the dummy hash
      let userPasswordHash;

      if (user && user.hashedPassword){
       userPasswordHash =  user.hashedPassword;
      }
      else{
         userPasswordHash = dummyHash;
      }
    
      // check password
        const isPasswordValid = await argon2.verify(userPasswordHash, password);
  
        // If password is invalid, return unauthorized
        if (!isPasswordValid) {
         res.status(401).json({
            message: 'Invalid email or password!'
          });
          return;
        }

        if (!user || !user.name || !user.email || !user._id) {
          return res.status(500).json({ message: 'User data is incomplete or invalid' });
        }

          // Construct token-safe payload
          const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user?.role || 'user', 
          };

        const accessToken = createAccessToken(userPayload);

        return res.status(201).json({ accessToken });

      }

    export const handleLogout = async (req: Request, res: Response)=>{
        console.log("logout request received");

        //handled in client
        res.status(200)
        .json({message: 'logout succesful'});
    };

const createAccessToken = (user: User | null) : string  => {

    const secret = process.env.JWTSECRET || "not very secret";
    const expiresTime = process.env.JWTEXPIRES || 60;
    console.log(expiresTime);
    const payload =
    {
        _id: user?.id, //include id to allow fetching of current id in angular app
        email: user?.email,
        name: user?.name,
        role: user?.role || 'user', 
    }
    const token = jwtSign(payload, secret, {expiresIn: parseInt(expiresTime.toString())}); 

    return token;

}

