export interface ProductoEntity {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}