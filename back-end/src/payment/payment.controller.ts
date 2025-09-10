import { Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('api')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-payment")
  async createPaymente(): Promise<Object>{
    return this.paymentService.createPayment()
  }

}
