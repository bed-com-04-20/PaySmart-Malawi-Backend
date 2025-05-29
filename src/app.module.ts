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
import { InstallmentsFeesPayment } from './pay-fees/entities/installment-payment.entity';
import { PayFeesModule } from './pay-fees/pay-fees.module';
import { StudentFee } from './pay-fees/entities/Student.entity';
import { MedicalModule } from './medical/medical.module';
import { PatientEntity } from './medical/entities/patient.entity';
import { InstallmentsHospitalPayment } from './medical/entities/hospita_fees.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d0rpub3e5dus739qmh6g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'paysmart_user',
      password: 'CYntENtDGPYyQQ3ysn781XiVg6x78iul',
      database: 'paysmart_database',
      entities: [RechargeEntity,HousePayment,InstallmentPayment,TVServiceEntity,TvPackageEntity,TVsubscription,PatientEntity,InstallmentsHospitalPayment ], // Add all your entities
      synchronize: true, // Set to false in production
      ssl: true, // Required for Render-hosted PostgreSQL
      extra: {
        ssl: {
          rejectUnauthorized: false, // Avoids SSL issues
        },
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'gambiza',
    //   database: 'paysmart_backend',
    //   entities: [RechargeEntity,HousePayment,InstallmentPayment,TVServiceEntity,TvPackageEntity,TVsubscription,InstallmentsFeesPayment,StudentFee ], // Add all your entities
    //   synchronize: true, // Set to false in production
    // }),

    
    PaymentGatewayModule,
    TvSubscriptionsModule,
    
    CustomRechargesModule,
    HousePaymentsModule,
    UserModule,
    PayFeesModule,
    MedicalModule
 
   
  ],
})
export class AppModule {}