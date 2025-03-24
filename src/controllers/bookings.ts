import { Request, Response } from "express";
import { classesCollection, usersCollection } from "../database";
import { ObjectId } from "mongodb";
import Class from "../models/class";
import User from "../models/user";

// Book a class (POST)
export const bookClass = async (req: Request, res: Response): Promise<any> => {
    const { userId, classId } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(classId)) {
        return res.status(400).json({ message: "Invalid user or class ID format" });
    }

    try {

        // check that userID exists in user model
        const userExists = await usersCollection.findOne({ _id: new ObjectId(userId) }) as User;
        if (!userExists) {
            res.status(404).json({message: `No user found with user id ${userId}`});
            return;
        }

        // check that classID exists in class model
        const classExists = await classesCollection.findOne({ _id: new ObjectId(classId) }) as Class;
        if (!classExists) {
            res.status(404).json({message: `No class found with class id ${classId}`});
            return;
        }

        // Check if class has available spaces
        if (classExists.spacesAvailable <= 0) {
            res.status(400).json({ message: "No available spaces in this class." });
            return;
        }

        // Check if user is already booked
        if (classExists.userIds?.includes(new ObjectId(userId))) {
            res.status(400).json({ message: "User already booked in this class." });
            return;
        }

        const classResult =  await classesCollection.updateOne(
            { _id: new ObjectId(classId) },
            { 
                $addToSet: { userIds: new ObjectId(userId) }, 
                $inc: { spacesAvailable: -1 }
            }
        );
        const userResult =   // Update User: Add classId to user's classIds
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { classIds: new ObjectId(classId) } }
        );
        if (classResult.modifiedCount > 0 && userResult.modifiedCount > 0) {
            res.status(200).json({ message: `Successfully updated booking with with class id ${classExists.id} and user ${userExists.id}` });
        } else {
            res.status(200).json({ message: `Booking already existed` });
        }
    

    } catch (error) {
        console.error("Error booking class:", error);
        res.status(500).json({ message: "An error occurred while booking the class." });
    }
};

// Cancel Booking 
export const cancelBooking = async (req: Request, res: Response): Promise<any> => {
    const { userId, classId } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(classId)) {
        res.status(400).json({ message: "Invalid user or class ID format" });
        return;
    }

    try {
        // Check if user exists
        const userExists = await usersCollection.findOne({ _id: new ObjectId(userId) }) as User;
        if (!userExists) {
            res.status(404).json({ message: `No user found with user id ${userId}` });
            return;
        }

        // Check if class exists
        const classExists = await classesCollection.findOne({ _id: new ObjectId(classId) }) as Class;
        if (!classExists) {
            res.status(404).json({ message: `No class found with class id ${classId}` });
            return;
        }

        // // Check if the user is actually booked in the class
        // if (!classExists.userIds?.includes(new ObjectId(userId))) {
        //     res.status(400).json({ message: "User is not booked in this class." });
        //     return;
        // }
        
        // Check if the user is actually booked in the class
        if (!classExists.userIds?.some(id => id.toString() === userId)) {
            res.status(400).json({ message: "User is not booked in this class." });
            return;
        }


        // Remove booking reference
        const classResult = await classesCollection.updateOne(
            { _id: new ObjectId(classId) },
            {
                $pull: { userIds: new ObjectId(userId) }, // Remove user from class
                $inc: { spacesAvailable: 1 } // Increment available spaces
            }
        );

        const userResult = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { classIds: new ObjectId(classId) } } // Remove class from user
        );

        if (classResult.modifiedCount > 0 && userResult.modifiedCount > 0) {
            res.status(200).json({ message: `Booking successfully canceled for class ${classId} and user ${userId}` });
        } else {
            res.status(400).json({ message: "Booking cancellation failed." });
        }

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "An error occurred while cancelling the booking." });
    }
};
