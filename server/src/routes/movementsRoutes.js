import express from 'express'
import movementsController from '../controllers/movementsController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/movement', movementsController.create)
router.get('/movement', movementsController.get)
router.get('/movement/:id', movementsController.getById)
router.put('/movement/:id', movementsController.update)
router.delete('/movement/:id', movementsController.remove)

export default router;