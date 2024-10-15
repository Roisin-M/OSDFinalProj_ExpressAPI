import { Request, response, Response } from "express";
import instructor from "../models/instructor";
import { instructorsCollection } from "../database";

export const getInstructors = async (req: Request, res:Response)=>{
    //get all instructors from the database
    res.json({"message":"getInstructors received"})
};

export const getInstructorById =(req:Request,res:Response)=>{
    //get a single instructor by ID from database
    let id:string = req.params.id;
    res.json({"message": `get instructor ${id} received`})
};

export const createInstructor=async (req:Request, res:Response)=>{
    // create a new instructor in the database 
    try { 
        //extract instructor data from request body
        const {name, yogaSpecialities, email}=req.body;
        // Create a new instructor object
        const newInstructor: instructor = {
          //...req.body,        // Spread operator to copy properties from the request body
          name,
          yogaSpecialities,
          email,
        };

    
        //let validateResult : Joi.ValidationResult = ValidateUser(req.body)
  
        // if (validateResult.error) {
        //   res.status(400).json(validateResult.error);
        //   return;
        // }     
  
        const result = await instructorsCollection.insertOne(newInstructor);
        if (result) { 
    
            res.status(201).location(`${result.insertedId}`).json({message : `Created a new instructor with id ${result.insertedId}`})} 
            else {  
            res.status(500).send("Failed to create a new instructor."); 
            } 
          }
        
        catch (error) {  
          if(error instanceof Error){
            console.log(`issue with inserting ${error.message}`);
          } 
          else{
            console.log(`error with ${error}`)
          }
          res.status(400).send(`Unable to create new instructor`); 
    } 
};

export const updateInstructor = (req:Request, res:Response)=>{
    console.log(req.body)
    res.json({"message":`update instructor ${req.params.id} with data from the post message`})
};

export const deleteInstructor =(req:Request,res:Response)=>{
    res.json({"message": `delete instructor ${req.params.id} from the database`})
};