import express, {Router} from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
import { validJWTProvided, requireRole } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id',validJWTProvided, requireRole('user'),deleteUser); //valid credentials needed, guarded delete route

export default router;