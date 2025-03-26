import express, {Router} from 'express';
import {
    handleLogin,
    handleLogout
} from '../controllers/auth';
import { handleInstructorLogin, handleInstructorLogout } from '../controllers/authInstructor';

const router: Router = express.Router();

router.post('/',  handleLogin);
router.post('/logout', handleLogout);
router.post('/instructor', handleInstructorLogin); 
router.post('/instructor/logout', handleInstructorLogout); 

export default router;