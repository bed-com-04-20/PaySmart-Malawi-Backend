import { Controller, Post, Body, Get } from '@nestjs/common';
import { FeesPaymentService } from './pay-fees.service';
import { CreateStudentFeePaymentDto } from './dto/create-pay-fee.dto';
import { CreateStudentFeeDto } from './dto/create-student-fee.dto';
import { StudentFee } from './entities/Student.entity';

@Controller('fees-payments')
export class FeesPaymentController {
  constructor(private readonly feesPaymentService: FeesPaymentService) {}

  // Endpoint for creating a new student fee record
  @Post('student')
  async createStudentFee(@Body() createDto: CreateStudentFeeDto): Promise<StudentFee> {
    return this.feesPaymentService.createStudentFee(createDto);
  }

  /**
   * Endpoint for recording a fee payment
   * POST /fees-payments/payment
   */
  @Post('payment')
  async recordPayment(@Body() createDto: CreateStudentFeePaymentDto) {
    return this.feesPaymentService.recordPayment(createDto);
  }

  /**
   * GET /fees-payments/balances
   * Retrieves the current remaining balances for all students.
   */
  @Get('balances')
  async getRemainingBalance() {
    return this.feesPaymentService.getRemainingBalance();
  }

  /**
   * GET /fees-payments/history
   * Retrieves the complete fee payment history for all students.
   */
  @Get('history')
  async getPaymentHistory() {
    return this.feesPaymentService.getPaymentHistory();
  }
}
