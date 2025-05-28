import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from './payment_gateway/payment_gateway.module';
import { TvSubscriptionsModule } from './tv_subscriptions/tv_subscriptions.module';
import { CustomRechargesModule } from './custom_recharges/custom_recharges.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HousePaymentsModule } from './house-payments/house-payments.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from './Entities/recharge.entity';
import { HousePayment } from './house-payments/entities/house-payment.entity';
import { InstallmentPayment } from './house-payments/entities/installmentPayment';
import { TVServiceEntity } from './Entities/TVservice.entity';
import { TvPackageEntity } from './Entities/TVpackages.entity';
import { TVsubscription } from './Entities/TVsubscription.entity';
import { InstallmentsFeesPayment } from './pay-fees/entities/installment-payment.entity';
import { PayFeesModule } from './pay-fees/pay-fees.module';
import { StudentFee } from './pay-fees/entities/Student.entity';

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
      database: 'paysmartdb',
       entities: [RechargeEntity,HousePayment,InstallmentPayment,TVServiceEntity,TvPackageEntity,TVsubscription,InstallmentsFeesPayment,StudentFee ], 
      synchronize: true,
    }),
//      TypeOrmModule.forRootAsync({
//   useFactory: async (configService: ConfigService) => ({
//     type: 'mysql',
//     host: configService.get<string>('DB_HOST'),
//     port: parseInt(configService.get<string>('DB_PORT') ?? '3306'),
//     username: configService.get<string>('DB_USERNAME'),
//     password: configService.get<string>('DB_PASSWORD'),
//     database: configService.get<string>('DB_NAME'),
//     synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
//     autoLoadEntities: true,
//     logging: true,
//   }),
//   inject: [ConfigService],
// }),


    
    PaymentGatewayModule,
    TvSubscriptionsModule,
    
    CustomRechargesModule,
    HousePaymentsModule,
    UserModule,
    PayFeesModule
 
   
  ],
})
export class AppModule {}
