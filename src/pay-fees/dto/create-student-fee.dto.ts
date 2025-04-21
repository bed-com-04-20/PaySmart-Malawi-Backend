// create-student-fee.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentFeeDto {
 @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

    @ApiProperty()
  @IsNotEmpty()
  @IsString()
  studentName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  yearOfStudy: string;

    @ApiProperty()
  @IsNotEmpty()
  @IsString()
  university: string;

    @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalFees: number;
}
