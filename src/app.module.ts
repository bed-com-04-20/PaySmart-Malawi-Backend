import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentGatewayModule } from './payment_gateway/payment_gateway.module';
import { TvSubscriptionsModule } from './tv_subscriptions/tv_subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from './Entities/recharge.entity';
import { UserModule } from './user/user.module';
import { CustomRechargesModule } from './custom_recharges/custom_recharges.module';
import { ConfigModule } from '@nestjs/config';
import { HouseManagementModule } from './house_management/house_management.module';
import { houseEntity } from './Entities/House.Entity';
import { HousePaymentsModule } from './house_payments/house_payments.module';
import { housePaymentEntity } from './Entities/house_payments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Change if using a remote database
      port: 5432, // Default PostgreSQL port
      username: 'postgres',
      password: 'tech-nest265',
      database: 'paysmart_malawi',
      entities: [RechargeEntity, houseEntity, housePaymentEntity],
      synchronize: true, // Set to false in production
    }),
    PaymentGatewayModule,
    TvSubscriptionsModule,
    UserModule,
    CustomRechargesModule,
    HouseManagementModule,
    HousePaymentsModule,
  ],
})
export class AppModule {}
