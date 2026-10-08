import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password) {
        res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres.' });
        return;
      }
      const result = await AuthUseCase.register(nombre, email, password);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
        return;
      }
      const result = await AuthUseCase.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ error: error.message });
      else next(error);
    }
  }
}