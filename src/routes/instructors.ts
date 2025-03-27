import express, {Router} from 'express';
import {
    getInstructors,
    getInstructorById,
    createInstructor,
    deleteInstructor,
    updateInstructorPatch,
    updateInstructorPut,
    getInstructorClasses,
} from '../controllers/instructors';
import { validJWTProvided, requireRole } from '../middleware/auth.middleware';
const router: Router=express.Router();

router.get('/',getInstructors);
router.get('/:id',getInstructorById);
router.get('/:id/classes', validJWTProvided, requireRole('instructor'), getInstructorClasses);
router.post('/',createInstructor);
router.put('/:id', validJWTProvided, requireRole('instructor'), updateInstructorPut);
router.patch('/:id',validJWTProvided, requireRole('instructor'),updateInstructorPatch);
router.delete('/:id',validJWTProvided, requireRole('instructor'), deleteInstructor);

export default router;