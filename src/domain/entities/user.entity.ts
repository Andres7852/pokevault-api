export interface UserEntity {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  createdAt?: Date;
  updatedAt?: Date;
}