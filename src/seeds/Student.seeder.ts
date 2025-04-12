// src/seed/students.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/Entities/Student';
import { UniversityEntity } from 'src/Entities/university';
import { Repository } from 'typeorm';



@Injectable()
export class StudentsSeeder {
  private readonly logger = new Logger(StudentsSeeder.name);

  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
  ) {}

  async seedStudents() {
    // Fetch all already seeded universities
    const universities = await this.universityRepository.find();
    if (!universities.length) {
      this.logger.error('No universities found. Please seed universities first.');
      return;
    }

    const totalStudents = 120;
    const studentsPerUniversity = totalStudents / universities.length; // Expects 6 universities for 20 students each
    const studentsToSeed: Partial<StudentEntity>[] = [];

    let studentCounter = 1;
    for (const university of universities) {
      for (let i = 0; i < studentsPerUniversity; i++) {
        studentsToSeed.push({
          registrationNumber: `REG-${studentCounter}`,
          name: `Student ${studentCounter}`,
          university: university,
        });
        studentCounter++;
      }
    }

    // Upsert each student using the unique registration number
    for (const studentData of studentsToSeed) {
      await this.studentRepository.upsert(studentData, ['registrationNumber']);
    }

    this.logger.log('✅ All students seeded successfully!');
  }
}
