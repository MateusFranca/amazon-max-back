import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  health() {
    return { statusCode: 200, message: 'OK' };
  }
}
