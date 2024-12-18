import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify } from 'jsonwebtoken'

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
        //take the request and look to see if there is a authorization 
        // header attached with a token which has a valid jwt as its value
      const authHeader = req.headers?.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer')) {
        console.log('no header ' + authHeader)
            res.status(401).send();
            return;
      }

      const token: string | undefined = authHeader.split(' ')[1];

      if (!token) { 
        //indicates the request lacks valid authentication credentials for the requested source
        res.status(401).send();
        return;
      }
      const secret = process.env.JWTSECRET || "not very secret";
    

      try{
        console.log(token);
        const payload = jwtVerify(token, secret);
        res.locals.payload = payload;
        next();
            

        } catch (err) {
            //access to the requested source is forbidden with the provided credentials
           res.status(403).send();
           return;
        }
    };
