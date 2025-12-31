import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as uuidValidate from 'uuid-validate';

@Injectable()
export class ValidacaoUuidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    if (id && !this.uuidValido(id)) {
      throw new BadRequestException(`ID inválido!`);
    }

    next();
  }

  private uuidValido(id: string): boolean {
    return uuidValidate(id, 4);
  }
}
