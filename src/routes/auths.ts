import express, {Router} from 'express';
import {
    handleLogin,
    handleLogout
} from '../controllers/auth';

const router: Router = express.Router();

router.post('/',  handleLogin);
router.post('/logout', handleLogout);
export default router;