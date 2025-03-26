import express, {Router} from 'express';
import { validJWTProvided, requireRole } from '../middleware/auth.middleware';
import { 
    getClasses,
    getClassById,
    createClass,
    updateClassPut,
    deleteClass,
    updateClassPatch
 } from '../controllers/classes';
 const router: Router=express.Router();

router.get('/',getClasses);
router.get('/:id',getClassById);
router.post('/', validJWTProvided, requireRole('instructor'), createClass);
router.put('/:id', validJWTProvided, requireRole('instructor'), updateClassPut);
router.patch('/:id',  validJWTProvided, requireRole('instructor'), updateClassPatch);
router.delete('/:id', validJWTProvided, requireRole('instructor'), deleteClass);

export default router;