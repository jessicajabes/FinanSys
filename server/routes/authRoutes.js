import authController from "../controllers/authController.js";
import express from 'express';

const router = express.Router();

router.post('/register', authController.register);

export default router;