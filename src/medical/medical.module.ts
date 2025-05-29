import { Module } from '@nestjs/common';
import { MedicalPaymentController } from './medical.controller';
import { MedicalPaymentService } from './medical.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entities/patient.entity';
import { InstallmentsHospitalPayment } from './entities/hospita_fees.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity,InstallmentsHospitalPayment,])], // Add your entities here, e.g., [PatientEntity, InstallmentsHospitalPayment]
  controllers: [MedicalPaymentController],
  providers: [MedicalPaymentService],
})
export class MedicalModule {}
