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

@Module({


  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'paysmart_malawi',
      entities:[RechargeEntity,houseEntity],
      synchronize: true,
   }),
    
    
    
     PaymentGatewayModule, TvSubscriptionsModule, UserModule, CustomRechargesModule, HouseManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
