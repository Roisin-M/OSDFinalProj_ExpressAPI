import express, {Router} from 'express';
import { 
    getClassLocations,
    getClassLocationsById,
    createClassLocation,
    updateClassLocationPut,
    deleteClassLocation, 
    updateClassLocationPatch
} from '../controllers/classLocations';
import { validJWTProvided, requireRole } from '../middleware/auth.middleware';
const router: Router=express.Router();

router.get('/',getClassLocations);
router.get('/:id',getClassLocationsById);
router.post('/',validJWTProvided, requireRole('instructor'),createClassLocation);
router.put('/:id', validJWTProvided, requireRole('instructor'), updateClassLocationPut);
router.patch('/:id',validJWTProvided, requireRole('instructor'),updateClassLocationPatch);
router.delete('/:id',validJWTProvided, requireRole('instructor'),deleteClassLocation);

export default router;