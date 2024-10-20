import { Request, Response } from "express";
import Class, {ValidateClass} from "../models/class";
import { classesCollection } from "../database";
import { ObjectId } from "mongodb";
import Joi from "joi";

// Get all classes
export const getClasses = async (req: Request, res: Response) => {
    try {
        // Allow filtering
        const { filter } = req.query;
        const filterObj = filter ? JSON.parse(filter as string) : {};

        // Allow pagination
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 0) || 0;

        // Fetch all classes from the database
        const classes = await classesCollection
            .find(filterObj)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray() as Class[];
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch classes." });
    }
};

// Get a class by ID
export const getClassById = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const classItem = (await classesCollection.findOne(query)) as Class;
        if (classItem) {
            res.status(200).send(classItem);
        } else {
            res.status(404).send(`Class not found with id: ${req.params.id}`);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};

// Create a new class
export const createClass = async (req: Request, res: Response) => {
    try {
        const { instructorId, description, classLocationId, date, startTime, endTime, level, type, category, classFormat, spacesAvailable 

        } = req.body;

        // Create a new class object
        const newClass: Class = {
            instructorId,  // No linking to instructor yet
            description,
            classLocationId,  // No linking to class location yet
            date,
            startTime,
            endTime,
            level,   // Class levels like Beginner, Intermediate
            type,    // Yoga specialities like Hatha, Vinyasa
            category, // Class categories like Balance, Strength
            classFormat, // Class format like Location, Stream, Both
            spacesAvailable // number of available spaces
        };

          // Validate the class data
          let validateResult: Joi.ValidationResult = ValidateClass(req.body);

          if (validateResult.error) {
              res.status(400).json(validateResult.error);
              return;
          }

        // Insert the new class into the database
        const result = await classesCollection.insertOne(newClass);
        if (result.insertedId) {
            res.status(201).location(`${result.insertedId}`).json({
                message: `Created a new class with id ${result.insertedId}`,
            });
        } else {
            res.status(500).send("Failed to create a new class.");
        }
    } catch (error) {
        res.status(400).send("Unable to create new class");
    }
};

// Update a class
export const updateClass = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    const updatedClass = req.body as Partial<Class>; // Partial allows updating only a subset of fields

    try {
        const query = { _id: new ObjectId(id) };
        const update = { $set: updatedClass }; // $set will only update the provided fields

        const result = await classesCollection.updateOne(query, update);

        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: `Successfully updated class with id ${id}` });
            } else {
                res.status(200).json({ message: `No changes made to class with id ${id}` });
            }
        } else {
            res.status(404).json({ message: `No class found with id ${id}` });
        }
    } catch (error) {
        res.status(500).send(`Error updating class with id ${id}`);
    }
};

// Delete a class by ID
export const deleteClass = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await classesCollection.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully removed class with id ${id}` });
        } else if (!result) {
            res.status(400).json({ message: `Failed to remove class with id ${id}` });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: `No class found with id ${id}` });
        }
    } catch (error) {
        res.status(400).send(error);
    }
};
