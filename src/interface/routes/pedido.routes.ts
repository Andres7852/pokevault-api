import { Router } from 'express';
import { PedidoController } from '../controllers/pedido.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();
router.use(authenticateToken);

router.post('/', PedidoController.create);
router.get('/mias', PedidoController.getMisPedidos);
router.get('/', requireAdmin, PedidoController.getAll);

export default router;