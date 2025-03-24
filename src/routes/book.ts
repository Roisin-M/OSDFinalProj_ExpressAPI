import express from "express";
import { bookClass } from "../controllers/bookings";

const router = express.Router();

// POST endpoint for booking a class
router.post('/', bookClass);

export default router;
