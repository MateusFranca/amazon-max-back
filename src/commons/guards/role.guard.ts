import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());
    if (!allowedRoles) return true;

    const request = context.switchToHttp().getRequest();
    const payload = request.tokenPayload;
    const perfil = payload?.aud;

    if (!perfil || !allowedRoles.includes(perfil)) {
      throw new ForbiddenException('Acesso não permitido para seu perfil');
    }
    return true;
  }
}
