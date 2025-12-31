import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Usuario } from 'src/commons/decorators/usuario.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { Response } from 'express';

@Controller('amazon/autenticacao')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('conectar')
  @ApiOperation({ summary: 'Autentica usuario' })
  async login(@Body() data: AuthLoginDTO) {
    return this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  @ApiOperation({ summary: 'Busca usuário pelo token' })
  @ApiBearerAuth()
  async me(@Usuario() usuario, @Res() res: Response) {
    return res.status(200).json({ usuario });
  }
}
