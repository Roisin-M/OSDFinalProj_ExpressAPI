import { Request, Response } from "express";
import instructor from "../models/instructor";
import { instructorsCollection } from "../database";
import { ObjectId } from "mongodb";

export const getInstructors = async (req: Request, res:Response)=>{
    try {
        // Fetch all instructors from the database
        const instructors = await instructorsCollection.find({}).toArray();
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch instructors." });
    }
};

export const getInstructorById = async (req:Request,res:Response)=>{
    //get a single instructor by ID from database
    let id:string = req.params.id;
    try{
        const query = {_id: new ObjectId(id)};
        const instructor = (await instructorsCollection.findOne(query)) as instructor;
        if(instructor){
            res.status(200).send(instructor);
        }
    } catch{
        res.status(404).send(`Unable to find matching document with id :
            ${req.params.id}`);
    }
};

export const createInstructor = async (req: Request, res: Response) => {
    try {
        const { name, yogaSpecialities, email } = req.body;

        const newInstructor: instructor = {
            name,
            yogaSpecialities,
            email
        };

        const result = await instructorsCollection.insertOne(newInstructor);
        if (result.insertedId) {
            res.status(201).location(`${result.insertedId}`).json({
                message: `Created a new instructor with id ${result.insertedId}`
            });
        } else {
            res.status(500).send("Failed to create a new instructor.");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Issue with inserting: ${error.message}`);
            res.status(400).send(`Unable to create new instructor: ${error.message}`);
        }
    }
};


export const updateInstructor = async (req:Request, res:Response)=>{
    let id: string = req.params.id;
    const updatedInstructor = req.body as Partial<instructor>;

    try {
        const query = { _id: new ObjectId(id) };
        const update = { $set: updatedInstructor }; // $set will only update the provided fields
    
        const result = await instructorsCollection.updateOne(query, update);
    
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

};

export const deleteInstructor =async (req:Request,res:Response)=>{

    let id:string=req.params.id;
    try{
        const query ={_id: new ObjectId(id)};
        const result = await instructorsCollection.deleteOne(query);

        if(result && result.deletedCount){
            res.status(202).json({message : `succesfully removed instructor with id 
                ${id}`});
        }else if(!result){
            res.status(400).json({message: `failed to remove user with id
                ${id}`});
        }else if(!result.deletedCount){
            res.status(404).json({message : `no instructor found with id
                ${id}`});
        }
    }catch (error){
        console.error(error);
        res.status(400).send(error);
    }
};