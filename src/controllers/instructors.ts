import { Request, response, Response } from "express";

export const getInstructors = async (req: Request, res:Response)=>{
    //get all instructors from the database
    res.json({"message":"getInstructors received"})
};

export const getInstructorById =(req:Request,res:Response)=>{
    //get a single instructor by ID from database
    let id:string = req.params.id;
    res.json({"message": `get instructor ${id} received`})
};

export const createInstructor= (req:Request, res:Response)=>{
    //create a new instructor in the database
    console.log(req.body);
    res.json({"message":`create a new instructor with data from the post message`})
};

export const updateInstructor = (req:Request, res:Response)=>{
    console.log(req.body)
    res.json({"message":`update instructor ${req.params.id} with data from the post message`})
};

export const deleteInstructor =(req:Request,res:Response)=>{
    res.json({"message": `delete instructor ${req.params.id} from the database`})
};