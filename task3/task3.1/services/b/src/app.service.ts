import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOrders(): string {
    return 'Order details from Service B';
  }
}
