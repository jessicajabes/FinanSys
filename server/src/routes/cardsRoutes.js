import express from 'express';
import cardsController from '../controllers/cardsController.js';
import authenticateToken from '../middleware/auth.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/cards', cardsController.create)
router.get('/cards', cardsController.get)
router.get('/cards/:id', cardsController.getById)
router.put('/cards/:id', cardsController.update)
router.delete('/cards/:id', cardsController.remove)

export default router;