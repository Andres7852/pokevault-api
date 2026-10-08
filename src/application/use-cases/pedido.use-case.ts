import { prisma } from '../../infrastructure/database/prisma';

export class PedidoUseCase {
  static async create(userId: number, productoId: number, cantidad: number, mensaje: string) {
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) throw { status: 404, message: 'El producto no existe.' };

    return prisma.pedido.create({
      data: { userId, productoId, cantidad, mensaje, total: producto.precio * cantidad },
      include: { producto: true, user: { select: { id: true, nombre: true, email: true } } },
    });
  }

  static async getMisPedidos(userId: number) {
    return prisma.pedido.findMany({
      where: { userId },
      include: { producto: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAll() {
    return prisma.pedido.findMany({
      include: { producto: true, user: { select: { id: true, nombre: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}