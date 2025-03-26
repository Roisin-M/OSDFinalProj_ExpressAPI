import { Request, Response, NextFunction, RequestHandler } from "express";
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
        console.log("Auth header:", authHeader);

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
    //middleware for role based authorisation for user and instructor
    // export const requireRole = (role: 'user' | 'instructor') => {
    //   return (req: Request, res: Response, next: NextFunction) => {
    //     const authRole = res.locals?.payload?.role;
    //     if (authRole !== role) {
    //       return res.status(403).json({ message: `Access denied: requires ${role} role` });
    //     }
    //     next();
    //   };
    // }; 
    export const requireRole = (role: 'user' | 'instructor'): RequestHandler => {
      return (req, res, next) => {
        const authRole = res.locals?.payload?.role;
        if (authRole !== role) {
          res.status(403).json({ message: `Access denied: requires ${role} role` });
          return;
        }
        next();
      };
    };
