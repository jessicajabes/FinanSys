import express from 'express'
import transactionController from '../controllers/transactionController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/transaction', transactionController.create)
router.get('/transaction', transactionController.getById)
router.get('/transaction/:id', transactionController.getById)
router.put('/transaction/:id', transactionController.update)
router.delete('/transaction/:id', transactionController.remove)

export default router;