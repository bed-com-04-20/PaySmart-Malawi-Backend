import { Module } from '@nestjs/common';
import { HousePaymentsService } from './house-payments.service';
import { HousePaymentsController } from './house-payments.controller';

@Module({
  controllers: [HousePaymentsController],
  providers: [HousePaymentsService],
})
export class HousePaymentsModule {}
