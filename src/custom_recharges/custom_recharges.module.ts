import { Module } from '@nestjs/common';
import { CustomRechargesController } from './controllers/custom_recharges/custom_recharges.controller';
import { CustomRechargesService } from './services/custom_recharges/custom_recharges.service';

@Module({
  controllers: [CustomRechargesController],
  providers: [CustomRechargesService]
})
export class CustomRechargesModule {}
