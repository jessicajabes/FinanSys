import express from 'express';
import categoriesController from '../controllers/categoriesController.js';
import authenticateToken from '../middleware/auth.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/categorie', categoriesController.create)
router.get('/categorie', categoriesController.get)
router.get('/categorie/:id', categoriesController.getById)
router.put('/categorie/:id', categoriesController.update)
router.delete('/categorie/:id', categoriesController.remove)

export default router;