import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof Prisma.PrismaClientKnownRequestError || err?.code) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Ya existe un registro con ese valor único.' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'El recurso solicitado no fue encontrado.' });
      return;
    }
  }

  console.error('[API Error]:', err.message || err);
  res.status(500).json({ error: 'Error interno en el servidor.' });
};