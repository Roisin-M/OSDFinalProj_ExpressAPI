import express from "express";
import { 
    bookClass,
    cancelBooking
 } from "../controllers/bookings";

const router = express.Router();

// POST endpoint for booking a class
router.post('/', bookClass);
router.delete('/cancel', cancelBooking);

export default router;
