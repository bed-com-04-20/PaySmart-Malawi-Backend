import { Module } from '@nestjs/common';
import { FeesPaymentsService } from './fees-payments.service';
import { FeesPaymentsController } from './fees-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from 'src/Entities/Student';
import { UniversityEntity } from 'src/Entities/university';
import { StudentsSeeder } from 'src/seeds/Student.seeder';
import { UniversitiesSeeder } from 'src/seeds/university';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity, UniversityEntity])], // Add your entities here if needed-
  controllers: [FeesPaymentsController],
  providers: [FeesPaymentsService, StudentsSeeder,UniversitiesSeeder],
  exports: [StudentsSeeder,UniversitiesSeeder], // ✅ Export it if needed in other modules
})
export class FeesPaymentsModule {
  constructor(private readonly studentsSeederService: StudentsSeeder,private readonly universitiesSeederService: UniversitiesSeeder) {
    this.studentsSeederService.seedStudents(); // ✅ Run the seeder when the module initializes
    this.universitiesSeederService.seedUniversities(); // ✅ Run the seeder when the module initializes
}}
