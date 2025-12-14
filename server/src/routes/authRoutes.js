import authController from "../controllers/authController.js";
import express from 'express';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user/:id', authController.getById);

router.use(authenticateToken);
router.put('/user/:id', authController.update);
router.delete('/user/:id', authController.remove)

export default router;




