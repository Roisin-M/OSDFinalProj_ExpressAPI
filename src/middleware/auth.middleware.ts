import { Request, Response, NextFunction } from "express";
import { 
  JsonWebTokenError,
   verify as jwtVerify,
  TokenExpiredError } from 'jsonwebtoken'

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
            res.status(401).json({ message: "Unauthorized: Missing token" });
            return;
      }

      const token: string | undefined = authHeader.split(' ')[1];
      const secret = process.env.JWTSECRET || "not very secret";
    
      try{
        console.log(token);
        const payload = jwtVerify(token, secret);
        res.locals.payload = payload;
        next();  
        } catch (err) {
          if (err instanceof TokenExpiredError) {
            console.log("Token expired");
            res.status(401).json({ message: "Unauthorized: Token expired" });
          } else if (err instanceof JsonWebTokenError) {
            console.log("Invalid token");
            res.status(403).json({ message: "Forbidden: Invalid token" });
          } else {
            console.log("Unknown error occurred during token verification");
            res.status(500).json({ message: "Internal server error" });
          }
        }
    };
