import express from "express";
import { 
    bookClass,
    cancelBooking
 } from "../controllers/bookings";
 import { validJWTProvided, requireRole } from '../middleware/auth.middleware';
const router = express.Router();

// POST endpoint for booking a class
router.post('/',validJWTProvided, requireRole('user'), bookClass);
router.delete('/cancel',validJWTProvided, requireRole('user'), cancelBooking);

export default router;
