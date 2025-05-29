import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientFeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  medicalId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hospital: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalFees: number;


}