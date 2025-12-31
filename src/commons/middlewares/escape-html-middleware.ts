import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EscaparDadosMiddleware implements NestMiddleware {
  private readonly logger = new Logger(EscaparDadosMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      req.body = this.escaparDados(req.body);
    }
    if (req.query) {
      req.query = this.escaparDados(req.query);
    }
    next();
  }

  private escaparDados(dado: any): any {
    if (typeof dado === 'string') {
      return dado.replace(/[<>"'&]/g, (char) => {
        switch (char) {
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          case '"':
            return '&quot;';
          case "'":
            return '&#39;';
          case '&':
            return '&amp;';
          default:
            return char;
        }
      });
    } else if (typeof dado === 'object') {
      for (const chave in dado) {
        if (dado.hasOwnProperty(chave)) {
          dado[chave] = this.escaparDados(dado[chave]);
        }
      }
    }
    return dado;
  }
}