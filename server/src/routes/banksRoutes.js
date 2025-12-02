import express from 'express'
import bankController from '../controllers/bankController.js'

const router = express.Router();

router.post('/bank', bankController.create)

router.get('/bank', bankController.getById)
router.get('/bank/:id', bankController.getById)
router.put('/bank/:id', bankController.update)
router.delete('/bank/:id', bankController.remove)

export default router;