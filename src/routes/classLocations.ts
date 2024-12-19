import express, {Router} from 'express';
import { 
    getClassLocations,
    getClassLocationsById,
    createClassLocation,
    updateClassLocationPut,
    deleteClassLocation, 
    updateClassLocationPatch
} from '../controllers/classLocations';
import { validJWTProvided } from '../middleware/auth.middleware';
const router: Router=express.Router();

router.get('/',getClassLocations);
router.get('/:id',getClassLocationsById);
router.post('/',createClassLocation);
router.put('/:id',updateClassLocationPut);
router.patch('/:id',updateClassLocationPatch);
router.delete('/:id',validJWTProvided,deleteClassLocation);

export default router;