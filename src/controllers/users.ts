import Joi from "joi";
import { Request, Response } from "express";
import User, {ValidateUser} from "../models/user";
import { usersCollection } from "../database";
import { ObjectId } from "mongodb";
import * as argon2 from 'argon2';

export const getUsers =async  (req: Request, res: Response) => {
   
    try {
     const users = (await usersCollection
        .find({})
        .project({password: 0}) //Exclude password
        .toArray()) as User[];
     res.status(200).json(users);
  
   } catch (error) {
    if(error instanceof Error){
      console.log(`issue with getting all users ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
     res.status(500).send("unable to get all documents");
   }
  };
  
  export const getUserById = async (req: Request, res: Response) => {
    //get a single  user by ID from the database
    
    let id:string = req.params.id;
    try {
      const query = { _id: new ObjectId(id) };
      const user = (await usersCollection.findOne(query,
         {projection: {password:0}})
        ) as User;
  
      if (user) {
          res.status(200).send(user);
      }
  } catch (error) {
    if(error instanceof Error){
      console.log(`issue with getting${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
      res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
  };

export const createUser = async (req: Request, res: Response) => {
    // create a new user in the database
    try {
  
      let validateResult : Joi.ValidationResult = ValidateUser(req.body)
  
      if (validateResult.error) {
        res.status(400).json(validateResult.error);
        return;
      }
  
      const existingUser = await usersCollection.findOne
      ({email: req.body.email
      });
  
      if (existingUser) {
        res.status(400).json({"error": "existing email"});
        return;
      }
  
      /// note - missing a check to verify the email belongs to the user
     
  
      let newUser : User = 
      { 
        name: req.body.name ,
        email: req.body.email,
        phonenumber : req.body.phonenumber,
      }
      //hashed password
      newUser.hashedPassword = await argon2.hash(req.body.password)
  
      console.log(newUser.hashedPassword)
  
      const result = await usersCollection.insertOne(newUser)
  
      if (result) {
          res.status(201)
          .location(`${result.insertedId}`)
          .json({message : 
            `Created a new user with id ${result.insertedId}`})}
          else {
          res.status(500).send("Failed to create a new user.");
          }
      }
     catch (error) {
      if (error instanceof Error)
      {
       console.log(`issue with inserting ${error.message}`);
      }
      else{
        console.log(`error with ${error}`)
      }
      res.status(400).send(`Unable to create new user`);
  }
  };

  export const updateUser = async (req: Request, res: Response) => {
  
    let id:string = req.params.id;
    const updatedUser = req.body as Partial<User>; // Partial type allows for updating only a subset of User properties
    //console.log(req.body); //for now just log the data
  
    try {
      const query = { _id: new ObjectId(id) };
      const update = { $set: updatedUser }; // $set will only update the provided fields
  
      const result = await usersCollection.updateOne(query, update);
  
      if (result.matchedCount > 0) {
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: `Successfully updated user with id ${id}` });
        } else {
          res.status(200).json({ message: `No changes made to user with id ${id}` });
        }
      } else {
        res.status(404).json({ message: `No user found with id ${id}` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error updating user with id ${id}`);
    }
    //res.json({"message": `update user ${req.params.id} with data from the post message`})
  };
  
  // export const deleteUser = (req: Request, res: Response) => {
  //   // logic to delete user by ID from the database
  
  //   res.json({"message": `delete user ${req.params.id} from the database`})
  // };
  export const deleteUser = async (req: Request, res: Response) => { 
    
    let id:string = req.params.id;
    try {
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
  
      if (result && result.deletedCount) {
          res.status(202).json({message :`Successfully removed user with id ${id}`});
      } else if (!result) {
          res.status(400).json({message: `Failed to remove user with id ${id}`});
      } else if (!result.deletedCount) {
          res.status(404).json({message: `no user fround with id ${id}`});
      }
  } catch (error) {
      console.error(error);
      res.status(400).send(error);
  }};
  