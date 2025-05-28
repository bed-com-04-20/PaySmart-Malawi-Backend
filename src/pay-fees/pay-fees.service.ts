import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';


import { InstallmentsFeesPayment } from './entities/installment-payment.entity';
import { StudentFee } from './entities/Student.entity';
import { CreateStudentFeePaymentDto } from './dto/create-pay-fee.dto';
import { CreateStudentFeeDto } from './dto/create-student-fee.dto';


interface PaymentResponse {
  success: boolean;
  checkout_url?: string;
  message?: string;
  data?: {
    checkout_url?: string;
  };
}

@Injectable()
export class FeesPaymentService {
  constructor(
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,

    @InjectRepository(InstallmentsFeesPayment)
    private readonly installmentPaymentRepository: Repository<InstallmentsFeesPayment>,
  ) {}
  async createStudentFee(dto: CreateStudentFeeDto): Promise<StudentFee> {
    // Check if a student with the same registration number already exists
    const existingStudent = await this.studentFeeRepository.findOne({
      where: { registrationNumber: dto.registrationNumber },
    });
    if (existingStudent) {
      throw new HttpException('Student already exists', HttpStatus.BAD_REQUEST);
    }

    // Create a new student record with default payment values:
    const newStudentFee = this.studentFeeRepository.create({
      registrationNumber: dto.registrationNumber,
      studentName: dto.studentName,
      yearOfStudy: dto.yearOfStudy,
      university: dto.university,
      totalFees: dto.totalFees,
      paidAmount: 0,
      remainingBalance: dto.totalFees, // initially all fees are unpaid
      isFullyPaid: false,
    });
    return await this.studentFeeRepository.save(newStudentFee);
  }

  /**
   * Records a fee payment, updates the student fee record,
   * creates an installment record, and initiates a transaction with PayChangu.
   */
  async recordPayment(dto: CreateStudentFeePaymentDto) {
    const { registrationNumber, amount } = dto;

    // Find the student fee record by registration number
    const studentFee = await this.studentFeeRepository.findOne({
      where: { registrationNumber },
    });
    if (!studentFee) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    // Validate amount
    if (!amount || amount <= 0) {
      throw new HttpException('Amount must be greater than zero', HttpStatus.BAD_REQUEST);
    }

    // Update the student fee record:
    // 1. Increase paidAmount with the new installment.
    // 2. Recalculate the remaining balance.
    // 3. Determine if fees are fully paid.
    studentFee.paidAmount += amount;
    studentFee.remainingBalance = studentFee.totalFees - studentFee.paidAmount;
    studentFee.isFullyPaid = studentFee.remainingBalance <= 0;

    // Save the updated student fee record
    await this.studentFeeRepository.save(studentFee);

    // Generate a transaction reference
    const transactionRef = `TX-${Date.now()}`;

    // Initiate the payment process with PayChangu API
    const paymentResponse = await this.initiatePayment(amount, transactionRef);
    if (!paymentResponse.success) {
      throw new HttpException(paymentResponse.message || 'Payment failed', HttpStatus.BAD_REQUEST);
    }

    // Create and save an installment payment record for tracking payment history
    const installment = this.installmentPaymentRepository.create({
      amountPaid: amount,
      transactionRef,
      studentFee: studentFee, // Associate installment with the student fee record
    });
    await this.installmentPaymentRepository.save(installment);

    return {
      message: 'Payment successful',
      transactionRef,
      paidAmount: studentFee.paidAmount,
      remainingBalance: studentFee.remainingBalance,
      checkoutUrl: paymentResponse.checkout_url,
    };
  }

  /**
   * Initiates a payment transaction with the PayChangu API.
   */
  async initiatePayment(amount: number, transactionRef: string): Promise<PaymentResponse> {
    try {
      // Construct the payment data for PayChangu
      const paymentData = {
        tx_ref: transactionRef,
        amount,
        currency: 'MWK', // Malawian Kwacha
        callback_url: 'https://your-website.com/payment-callback', // Replace with your actual callback URL
      };

      // Send request to the PayChangu API
      const response = await axios.post<PaymentResponse>(
        'https://api.paychangu.com/payment',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is correctly set in your environment variables
            'Content-Type': 'application/json',
          },
        },
      );

      // Debug: Log the API response
      console.log('Payment API Response:', response.data);

      // Get checkout URL from the nested response data
      const checkoutUrl = response.data?.data?.checkout_url;
      if (checkoutUrl) {
        return { success: true, checkout_url: checkoutUrl };
      } else {
        console.error('Invalid response format:', response.data);
        return { success: false, message: 'Invalid response from payment API' };
      }
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data || error.message };
    }
  }

  /**
   * Retrieves the remaining fee balance for a student.
   */
  async getRemainingBalance() {
    const studentFees = await this.studentFeeRepository.find();
    const transactionRef = `TX-${Date.now()}`;

    return studentFees.map(studentFee => ({
      transactionRef,
      registrationNumber: studentFee.registrationNumber,
      totalFees: studentFee.totalFees,
      paidAmount: studentFee.paidAmount,
      remainingBalance: studentFee.remainingBalance,
      isFullyPaid: studentFee.isFullyPaid,
    }));
  }

  /**
   * Retrieves the fee payment history for a specific student.
   */
  async getPaymentHistory() {
    return this.installmentPaymentRepository.find({
      relations: ['studentFee'], // Loads necessary relation details
      
      select: {
        
        id: true,
        amountPaid: true,
        transactionRef: true,
        studentFee: { registrationNumber: true, totalFees: true },
      },
    });
  }
}
