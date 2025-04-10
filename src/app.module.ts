import { Module } from '@nestjs/common';
import { PaymentGatewayModule } from './payment_gateway/payment_gateway.module';
import { TvSubscriptionsModule } from './tv_subscriptions/tv_subscriptions.module';
import { CustomRechargesModule } from './custom_recharges/custom_recharges.module';
import { ConfigModule } from '@nestjs/config';
import { HousePaymentsModule } from './house-payments/house-payments.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from './Entities/recharge.entity';
import { HousePayment } from './house-payments/entities/house-payment.entity';
import { InstallmentPayment } from './house-payments/entities/installmentPayment';
import { TVServiceEntity } from './Entities/TVservice.entity';
import { TvPackageEntity } from './Entities/TVpackages.entity';
import { TVsubscription } from './Entities/TVsubscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'dpg-cv6t0g56l47c73dbilr0-a.oregon-postgres.render.com',
    //   port: 5432,
    //   username: 'paysmart_backend_user',
    //   password: 'bLg5kfZXFLcuywytNftc566Q7yV0SsY5',
    //   database: 'paysmart_backend',
    //   entities: [RechargeEntity,HousePayment,InstallmentPayment,TVServiceEntity,TvPackageEntity,TVsubscription ], // Add all your entities
    //   synchronize: true, // Set to false in production
    //   ssl: true, // Required for Render-hosted PostgreSQL
    //   extra: {
    //     ssl: {
    //       rejectUnauthorized: false, // Avoids SSL issues
    //     },
    //   },
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'gambiza',
      database: 'paysmart_backend',
      entities: [RechargeEntity,HousePayment,InstallmentPayment,TVServiceEntity,TvPackageEntity,TVsubscription ], // Add all your entities
      synchronize: true, // Set to false in production
    }),

    
    PaymentGatewayModule,
    TvSubscriptionsModule,
    
    CustomRechargesModule,
    HousePaymentsModule,
    UserModule,
 
   
  ],
})
export class AppModule {}
