import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getCalculation(): Promise<string> {
    const url = process.env.SERVICE_B_URL || 'http://service-b:8080';
    const response = await firstValueFrom(this.httpService.get(url));
    return `Calculation result based on: ${response.data}`;
  }
}
