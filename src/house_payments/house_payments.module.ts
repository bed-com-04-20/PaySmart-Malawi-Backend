import { Module } from '@nestjs/common';
import { HousePaymentsController } from './controllers/house_payments/house_payments.controller';
import { HousePaymentsService } from './services/house_payments/house_payments.service';

@Module({
  
  controllers: [HousePaymentsController],
  providers: [HousePaymentsService]
})
export class HousePaymentsModule {}
