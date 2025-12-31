import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: AuthLoginDTO) {
    const usuario = await this.usuarioService.encontrarPorEmail(data.email);
    if (!usuario || !(await bcrypt.compare(data.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (usuario.cargo !== 'Administrador' && usuario.cargo !== 'Vendedor') {
      throw new UnauthorizedException('Acesso não autorizado para este cargo');
    }

    const aud = usuario.cargo === 'Administrador' ? 'admin' : 'vendedor';

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
    };

    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: '12h',
      audience: aud,
    });

    return { token };
  }

  verificarToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (data.iss) {
        throw new UnauthorizedException('Token inválido');
      }

      return data;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
