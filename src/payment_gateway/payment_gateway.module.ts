import { Module } from '@nestjs/common';
import { PaymentGatewayController } from './controller/payment_gateway/payment_gateway.controller';
import { PaymentWayService } from './service/payment_way/payment_way.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from 'src/Entities/recharge.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([RechargeEntity]),
    HttpModule],
  controllers: [PaymentGatewayController],
  providers: [PaymentWayService]
})
export class PaymentGatewayModule {}
