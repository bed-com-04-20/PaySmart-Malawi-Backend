import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RechargesModule } from './recharges/recharges.module';
import { CustomRechargesController } from './custom_recharges/controllers/custom_recharges/custom_recharges.controller';
import { CustomRechargesService } from './custom_recharges/services/custom_recharges/custom_recharges.service';
import { PaymentGatewayModule } from './payment_gateway/payment_gateway.module';
import { TvSubscriptionsModule } from './tv_subscriptions/tv_subscriptions.module';

@Module({
  imports: [RechargesModule, PaymentGatewayModule, TvSubscriptionsModule],
  controllers: [AppController, CustomRechargesController],
  providers: [AppService, CustomRechargesService],
})
export class AppModule {}
