import { Controller, Post, Body, Get } from '@nestjs/common';

import { CreatePatientFeeDto } from './dto/create-medical.dto';
import { MedicalPaymentService } from './medical.service';
import { CreateHospitalFeePaymentDto } from './dto/create-pay-fee.dto';
import { PatientEntity } from './entities/patient.entity';


@Controller('medical-payments')
export class MedicalPaymentController {
  constructor(private readonly medicalPaymentService: MedicalPaymentService) {}

  // Endpoint for creating a new patient fee record
  @Post('patient')
  async createPatientFee(@Body() createDto: CreatePatientFeeDto): Promise<PatientEntity> {
    return this.medicalPaymentService.createPatient(createDto);
  }

  /**
   * Endpoint for recording a hospital fee payment
   * POST /medical-payments/payment
   */
  @Post('payment')
  async recordPayment(@Body() createDto:CreateHospitalFeePaymentDto) {
    return this.medicalPaymentService.recordPayment(createDto);
  }

  /**
   * GET /medical-payments/balances
   * Retrieves the current remaining balances for all patients.
   */
  @Get('balances')
  async getRemainingBalance() {
    return this.medicalPaymentService.getRemainingBalance();
  }

  /**
   * GET /medical-payments/history
   * Retrieves the complete fee payment history for all patients.
   */
  @Get('history')
  async getPaymentHistory() {
    return this.medicalPaymentService.getPaymentHistory();
  }
}