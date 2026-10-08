import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();
router.get('/', ProductoController.getAll);
router.get('/:id', ProductoController.getById);

router.post('/', authenticateToken, requireAdmin, ProductoController.create);
router.put('/:id', authenticateToken, requireAdmin, ProductoController.update);
router.delete('/:id', authenticateToken, requireAdmin, ProductoController.delete);

export default router;