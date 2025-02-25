import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rechargeEntity } from 'src/Entities/recharge.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([rechargeEntity])
    ],
})
export class RechargesModule {}
