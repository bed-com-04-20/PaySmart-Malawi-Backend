import { Module } from '@nestjs/common';
import { HouseManagementController } from './controllers/house_management/house_management.controller';
import { HouseManagementService } from './services/house_management/house_management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { houseEntity } from 'src/Entities/House.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([houseEntity])],
  
  controllers: [HouseManagementController],
  providers: [HouseManagementService]
})
export class HouseManagementModule {}
