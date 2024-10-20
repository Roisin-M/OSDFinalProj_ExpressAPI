import { Request, Response } from "express";
import ClassLocation from "../models/classLocation";
import { classLocationsCollection, instructorsCollection } from "../database";
import { ObjectId } from "mongodb";

//get all class locations
export const getClassLocations = async (req: Request, res:Response)=>{
    try {

        //allow filter searching
        const {filter}=req.query;
        const filterobj=filter?JSON.parse(filter as string):{};

        //GET allow paging
        const page = parseInt(req.query.page as string,10) || 1;
        const pageSize = parseInt(req.query.pageSize as string,0) || 0;

        // Fetch all class locations from the database
        //filtering enabled
        //project - don't include object id
        //sorting by name in ascending / alphabetical order
        const classLocations = await classLocationsCollection
        .find(filterobj)
        .project({'_id':0})
        .sort({'name':1})
        .skip((page-1)*pageSize)
        .limit(pageSize)
        .toArray() as ClassLocation[];
        res.status(200).json(classLocations);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch class locations." });
    }
};

export const getClassLocationsById = async (req:Request,res:Response)=>{
    //get a single class Location by ID from database
    let id:string = req.params.id;
    try{
        const query = {_id: new ObjectId(id)};
        const classLocation = (await classLocationsCollection.findOne(query)) as ClassLocation;
        if(classLocation){
            res.status(200).send(classLocation);
        }
    } catch{
        res.status(404).send(`Unable to find matching document with id :
            ${req.params.id}`);
    }
};

// Create a new class location
export const createClassLocation = async (req: Request, res: Response) => {
    try {
        // Extract class Location data from request body
        const { name, maxCapacity, location, classFormats  } = req.body;

        // Create a new class Location object 
        const newClassLocation: ClassLocation = {
            name,
            maxCapacity,
            location,
            classFormats,
        };

        // Insert the new class Location into the database
        const result = await classLocationsCollection.insertOne(newClassLocation);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({
                message: `Created a new class location with id ${result.insertedId}`,
            });
        } else {
            res.status(500).send("Failed to create a new class location.");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Issue with inserting: ${error.message}`);
        } else {
            console.log(`Error with: ${error}`);
        }
        res.status(400).send("Unable to create new class location");
    }
};

// Update a class location
export const updateClassLocation = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    const updatedClassLocation = req.body as Partial<ClassLocation>; // Partial type allows for updating only a subset of Class Location properties

    try {
        const query = { _id: new ObjectId(id) };
        const update = { $set: updatedClassLocation }; // $set will only update the provided fields

        const result = await classLocationsCollection.updateOne(query, update);

        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: `Successfully updated class location with id ${id}` });
            } else {
                res.status(200).json({ message: `No changes made to class location with id ${id}` });
            }
        } else {
            res.status(404).json({ message: `No class location found with id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating class location with id ${id}`);
    }
};

//delete class location by id
export const deleteClassLocation =async (req:Request,res:Response)=>{

    let id:string=req.params.id;
    try{
        const query ={_id: new ObjectId(id)};
        const result = await classLocationsCollection.deleteOne(query);

        if(result && result.deletedCount){
            res.status(202).json({message : `succesfully removed class location with id 
                ${id}`});
        }else if(!result){
            res.status(400).json({message: `failed to remove class location with id
                ${id}`});
        }else if(!result.deletedCount){
            res.status(404).json({message : `no class location found with id
                ${id}`});
        }
    }catch (error){
        console.error(error);
        res.status(400).send(error);
    }
};