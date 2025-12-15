import express from 'express'
import bankController from '../controllers/bankController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/bank', bankController.create)
router.get('/bank', bankController.get)
router.get('/bank/:id', bankController.getById)
router.put('/bank/:id', bankController.update)
router.delete('/bank/:id', bankController.remove)

export default router;