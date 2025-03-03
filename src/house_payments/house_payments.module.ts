import { Module } from '@nestjs/common';
import { HousePaymentsController } from './controllers/house_payments/house_payments.controller';
import { HousePaymentsService } from './services/house_payments/house_payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { housePaymentEntity } from 'src/Entities/house_payments.entity';
import { houseEntity } from 'src/Entities/House.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([housePaymentEntity, houseEntity])],
  controllers: [HousePaymentsController],
  providers: [HousePaymentsService]
})
export class HousePaymentsModule {}
