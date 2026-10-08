import { prisma } from '../../infrastructure/database/prisma';

export class ProductoUseCase {
  static async getAll(page = 1, limit = 6, categoria?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (categoria && categoria !== 'todos') where.categoria = categoria;
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({ where, skip, take: limit, orderBy: { id: 'asc' } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      pagination: { page, limit, total, totalPages: totalPages === 0 ? 1 : totalPages },
      data,
    };
  }

  static async getById(id: number) {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) throw { status: 404, message: 'Producto no encontrado.' };
    return producto;
  }

  static async create(data: { nombre: string; categoria: string; precio: number; imagen: string; descripcion: string }) {
    return prisma.producto.create({ data });
  }

  static async update(id: number, data: any) {
    await this.getById(id);
    return prisma.producto.update({ where: { id }, data });
  }

  static async delete(id: number) {
    await this.getById(id);
    return prisma.producto.delete({ where: { id } });
  }
}