import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/autenticacao/auth.service';
import { UsuarioService } from 'src/modules/usuario/usuario.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const token = (authorization ?? '').split(' ')[1];
      const data = this.authService.verificarToken(token);

      request.tokenPayload = data;

      const usuario = await this.usuarioService.buscarPorId(data.id);
      request.usuario = usuario;

      if (data.id !== usuario.id) {
        throw new UnauthorizedException('Usuário não autorizado');
      }

      return true;
    } catch (error) {
      if (error.response && error.response.message === 'jwt expired') {
        throw new UnauthorizedException('Solicitação expirada');
      } else {
        throw new UnauthorizedException('Erro durante a autenticação');
      }
    }
  }
}
