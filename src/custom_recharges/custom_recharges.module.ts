import { Module } from '@nestjs/common';
import { CustomRechargesController } from './controllers/custom_recharges/custom_recharges.controller';
import { CustomRechargesService } from './services/custom_recharges/custom_recharges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeEntity } from 'src/Entities/recharge.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RechargeEntity])],
  controllers: [CustomRechargesController],
  providers: [CustomRechargesService]
})
export class CustomRechargesModule {}
