import { Request, Response, NextFunction } from 'express';
import { JwtService, TokenPayload } from '../../infrastructure/security/jwt.service';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Acceso no autorizado: No se proporcionó un token de autenticación válido.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Acceso no autorizado: Token inválido o expirado.',
    });
  }
};