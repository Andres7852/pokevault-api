import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PedidoUseCase } from '../../application/use-cases/pedido.use-case';

export class PedidoController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { productoId, cantidad, mensaje } = req.body;
      if (!productoId || !cantidad || !mensaje) {
        res.status(400).json({ error: 'productoId, cantidad y mensaje son obligatorios.' });
        return;
      }
      const pedido = await PedidoUseCase.create(userId, parseInt(productoId), parseInt(cantidad), mensaje);
      res.status(201).json(pedido);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }

  static async getMisPedidos(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const pedidos = await PedidoUseCase.getMisPedidos(userId);
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pedidos = await PedidoUseCase.getAll();
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  static async updateEstado(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }
      const { estado } = req.body;
      if (!estado) { res.status(400).json({ error: 'El campo estado es obligatorio.' }); return; }
      const pedido = await PedidoUseCase.updateEstado(id, estado);
      res.status(200).json(pedido);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }
}