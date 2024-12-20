import express, {Router} from 'express';
import {
    getInstructors,
    getInstructorById,
    createInstructor,
    deleteInstructor,
    updateInstructorPatch,
    updateInstructorPut,
} from '../controllers/instructors';
import { validJWTProvided } from '../middleware/auth.middleware';
const router: Router=express.Router();

router.get('/',getInstructors);
router.get('/:id',getInstructorById);
router.post('/',createInstructor);
router.put('/:id', validJWTProvided, updateInstructorPut);
router.patch('/:id',updateInstructorPatch);
router.delete('/:id',validJWTProvided, deleteInstructor);

export default router;