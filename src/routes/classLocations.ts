import express, {Router} from 'express';
import { 
    getClassLocations,
    getClassLocationsById,
    createClassLocation,
    updateClassLocation,
    deleteClassLocation 
} from '../controllers/classLocations';
const router: Router=express.Router();

router.get('/',getClassLocations);
router.get('/:id',getClassLocationsById);
router.post('/',createClassLocation);
router.put('/:id',updateClassLocation);
router.delete('/:id',deleteClassLocation);

export default router;