import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { FeesPaymentService } from './pay-fees.service';
import { CreateStudentFeePaymentDto } from './dto/create-pay-fee.dto';

@Controller('fees-payments')
export class FeesPaymentController {
  constructor(private readonly feesPaymentService: FeesPaymentService) {}

  /**
   * POST /fees-payments
   * Records a fee payment for a student using the provided payment data.
   */
  @Post()
  async recordPayment(@Body() createDto: CreateStudentFeePaymentDto) {
    return this.feesPaymentService.recordPayment(createDto);
  }

  /**
   * GET /fees-payments/:registrationNumber/balance
   * Retrieves the current remaining balance for the student with the specified registration number.
   */
  @Get(':registrationNumber/balance')
  async getRemainingBalance(
    @Param('registrationNumber') registrationNumber: string,
  ) {
    return this.feesPaymentService.getRemainingBalance(registrationNumber);
  }

  /**
   * GET /fees-payments/:registrationNumber/history
   * Retrieves the complete fee payment history for the student with the specified registration number.
   */
  @Get(':registrationNumber/history')
  async getPaymentHistory(
    @Param('registrationNumber') registrationNumber: string,
  ) {
    return this.feesPaymentService.getPaymentHistory(registrationNumber);
  }
}
