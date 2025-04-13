import { Module } from '@nestjs/common';
import { FeesPaymentController } from './pay-fees.controller';
import { FeesPaymentService } from './pay-fees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallmentsFeesPayment } from './entities/installment-payment.entity';
import { StudentFee } from './entities/Student.entity';
import { InstallmentPayment } from 'src/house-payments/entities/installmentPayment';


@Module({
  imports: [TypeOrmModule.forFeature([InstallmentsFeesPayment , StudentFee ])],
  controllers: [FeesPaymentController],
  providers: [FeesPaymentService ],
})
export class PayFeesModule {}
