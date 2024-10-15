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

export const getInstructorById =(req:Request,res:Response)=>{
    //get a single instructor by ID from database
    let id:string = req.params.id;
    res.json({"message": `get instructor ${id} received`})
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
            res.status(201).location(`/instructors/${result.insertedId}`).json({
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


export const updateInstructor = (req:Request, res:Response)=>{
    console.log(req.body)
    res.json({"message":`update instructor ${req.params.id} with data from the post message`})
};

export const deleteInstructor =(req:Request,res:Response)=>{
    res.json({"message": `delete instructor ${req.params.id} from the database`})
};