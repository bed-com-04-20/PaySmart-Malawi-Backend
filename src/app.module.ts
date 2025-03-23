import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentGatewayModule } from './payment_gateway/payment_gateway.module';
import { TvSubscriptionsModule } from './tv_subscriptions/tv_subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from './Entities/recharge.entity';

import { CustomRechargesModule } from './custom_recharges/custom_recharges.module';
import { ConfigModule } from '@nestjs/config';
import { TVServiceEntity } from './Entities/TVservice.entity';
import { TvPackageEntity } from './Entities/TVpackages.entity';
import { TVsubscription } from './Entities/TVsubscription.entity';
import { HousePaymentsModule } from './house-payments/house-payments.module';
import { HousePayment } from './house-payments/entities/house-payment.entity';
import { InstallmentPayment } from './house-payments/entities/installmentPayment';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false, 
      autoLoadEntities: true,
      migrations: ['dist/migrations/*.js'], 
      entities: [
        TVServiceEntity, 
        TvPackageEntity, 
        TVsubscription, 
        RechargeEntity, 
        HousePayment, 
        InstallmentPayment, 
        User],
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
    
    PaymentGatewayModule,
    TvSubscriptionsModule,
    
    CustomRechargesModule,
    HousePaymentsModule,
    UserModule,
 
   
  ],
})
export class AppModule {}
