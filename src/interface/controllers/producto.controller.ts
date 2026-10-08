import { Request, Response, NextFunction } from 'express';
import { ProductoUseCase } from '../../application/use-cases/producto.use-case';

export class ProductoController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const categoria = req.query.categoria as string;
      const search = req.query.search as string;
      const result = await ProductoUseCase.getAll(page, limit, categoria, search);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido.' });
        return;
      }
      const producto = await ProductoUseCase.getById(id);
      res.status(200).json(producto);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, categoria, precio, imagen, descripcion } = req.body;
      if (!nombre || !categoria || precio === undefined || !imagen || !descripcion) {
        res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        return;
      }
      const nuevo = await ProductoUseCase.create({ nombre, categoria, precio: parseFloat(precio), imagen, descripcion });
      res.status(201).json(nuevo);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido.' });
        return;
      }
      const actualizado = await ProductoUseCase.update(id, req.body);
      res.status(200).json(actualizado);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido.' });
        return;
      }
      await ProductoUseCase.delete(id);
      res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }
}