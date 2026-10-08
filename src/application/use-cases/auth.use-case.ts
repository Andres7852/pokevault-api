import { prisma } from '../../infrastructure/database/prisma';
import { HashService } from '../../infrastructure/security/hash.service';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { Role } from '@prisma/client';

export class AuthUseCase {
  static async register(nombre: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw { status: 409, message: 'El correo electrónico ya se encuentra registrado.' };
    }

    const hashedPassword = await HashService.hash(password);

    const user = await prisma.user.create({
      data: { nombre, email, password: hashedPassword, role: Role.USER },
      select: { id: true, nombre: true, email: true, role: true, createdAt: true },
    });

    const token = JwtService.generateToken({ id: user.id, role: user.role });
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { status: 401, message: 'Credenciales inválidas. Revisa tu correo y contraseña.' };
    }

    const isMatch = await HashService.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Credenciales inválidas. Revisa tu correo y contraseña.' };
    }

    const token = JwtService.generateToken({ id: user.id, role: user.role });
    return {
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role },
      token,
    };
  }
}