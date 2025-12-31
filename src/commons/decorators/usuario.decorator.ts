import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const Usuario = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.usuario) {
      if (filter) {
        return request.usuario[filter];
      } else {
        return request.usuario;
      }
    } else {
      throw new NotFoundException(`Usuario não encontraado`);
    }
  },
);
