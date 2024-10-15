import express, {Router} from 'express';
import {
    getInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor,
} from '../controllers/instructors';
const router: Router=express.Router();

router.get('/',getInstructors);
router.get('/:id',getInstructorById);
router.post('/',createInstructor);
router.put('/:id',updateInstructor);
router.delete('/:id',deleteInstructor);

export default router;