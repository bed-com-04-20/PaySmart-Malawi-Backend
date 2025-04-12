import { HttpException, Injectable } from '@nestjs/common';
import { CreateFeesPaymentDto } from './dto/create-fees-payment.dto';
import { UpdateFeesPaymentDto } from './dto/update-fees-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UniversityEntity } from 'src/Entities/university';
import { Repository } from 'typeorm';
import { StudentEntity } from 'src/Entities/Student';

@Injectable()
export class FeesPaymentsService {
  constructor(
    @InjectRepository(UniversityEntity)
    private readonly feesPaymentRepository: Repository<UniversityEntity>,

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    ) {}

    async processFeesPaymnet(dto:CreateFeesPaymentDto){
        const {feeId, registrationNumber} = dto;

        if (!registrationNumber) {
          throw new HttpException('Registration number is required', 400);
      }
      const Student = await this.studentRepository.findOne({
        where: { registrationNumber },
        relations: ['university'],
      });
      if (!Student) {
        throw new HttpException('Student not found', 404);
      }

    }
  
}
