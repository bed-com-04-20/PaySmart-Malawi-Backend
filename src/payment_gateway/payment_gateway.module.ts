import { Module } from '@nestjs/common';
import { PaymentGatewayController } from './controller/payment_gateway/payment_gateway.controller';
import { PaymentWayService } from './service/payment_way/payment_way.service';

@Module({
  controllers: [PaymentGatewayController],
  providers: [PaymentWayService]
})
export class PaymentGatewayModule {}
