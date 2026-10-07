export interface PedidoEntity {
  id: number;
  userId: number;
  productoId: number;
  cantidad: number;
  mensaje: string;
  total: number;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}