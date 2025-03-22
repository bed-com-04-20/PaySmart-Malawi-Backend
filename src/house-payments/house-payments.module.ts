import { Module } from '@nestjs/common';
import { HousePaymentsService } from './house-payments.service';
import { HousePaymentsController } from './house-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallmentPayment } from './entities/installmentPayment';
import { HousePayment } from './entities/house-payment.entity';
import { HouseSeeder } from 'src/seeds/house.seeder';


@Module({
  imports:[TypeOrmModule.forFeature([InstallmentPayment,HousePayment])],
  controllers: [HousePaymentsController],
  providers: [HousePaymentsService, HouseSeeder],
  exports: [HouseSeeder], // ✅ Export it if needed in other modules
})
export class HousePaymentsModule {
  constructor(private readonly houseSeederService: HouseSeeder) {
    this.houseSeederService.seedHouses(); // ✅ Run the seeder when the module initializes
  }
}
