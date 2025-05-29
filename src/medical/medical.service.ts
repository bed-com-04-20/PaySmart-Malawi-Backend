import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { PatientEntity } from './entities/patient.entity';
import { InstallmentsHospitalPayment } from './entities/hospita_fees.entity';
import { CreatePatientFeeDto } from './dto/create-medical.dto';
import { CreateHospitalFeePaymentDto } from './dto/create-pay-fee.dto';



interface PaymentResponse {
  success: boolean;
  checkout_url?: string;
  message?: string;
  data?: {
    checkout_url?: string;
  };
}

@Injectable()
export class MedicalPaymentService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,

    @InjectRepository(InstallmentsHospitalPayment)
    private readonly installmentPaymentRepository: Repository<InstallmentsHospitalPayment>,
  ) {}

  async createPatient(dto: CreatePatientFeeDto): Promise<PatientEntity> {
    // Check if a patient with the same medical ID already exists
    const existingPatient = await this.patientRepository.findOne({
      where: { medicalId: dto.medicalId },
    });
    if (existingPatient) {
      throw new HttpException('Patient already exists', HttpStatus.BAD_REQUEST);
    }

    // Create a new patient record with default payment values
    const newPatient = this.patientRepository.create({
      medicalId: dto.medicalId,
      PatientName: dto.patientName, // Match entity field case
      hospital: dto.hospital, // Corrected from 'Hospital'
      totalFees: dto.totalFees,
      paidAmount: 0,
      remainingBalance: dto.totalFees,
      isFullyPaid: false,
    });
    return await this.patientRepository.save(newPatient);
  }

  /**
   * Records a hospital fee payment, updates the patient record,
   * creates an installment record, and initiates a transaction with PayChangu.
   */
  async recordPayment(dto:CreateHospitalFeePaymentDto) {
    const { medicalId, amount } = dto;

    // Find the patient record by medical ID
    const patient = await this.patientRepository.findOne({
      where: { medicalId },
    });
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Validate amount
    if (!amount || amount <= 0) {
      throw new HttpException('Amount must be greater than zero', HttpStatus.BAD_REQUEST);
    }

    // Update the patient record
    patient.paidAmount += amount;
    patient.remainingBalance = patient.totalFees - patient.paidAmount;
    patient.isFullyPaid = patient.remainingBalance <= 0;

    // Save the updated patient record
    await this.patientRepository.save(patient);

    // Generate a transaction reference
    const transactionRef = `TX-${Date.now()}`;

    // Initiate the payment process with PayChangu API
    const paymentResponse = await this.initiatePayment(amount, transactionRef);
    if (!paymentResponse.success) {
      throw new HttpException(paymentResponse.message || 'Payment failed', HttpStatus.BAD_REQUEST);
    }

    // Create and save an installment payment record
    const installment = this.installmentPaymentRepository.create({
      amountPaid: amount,
      transactionRef,
      hospitalFee: patient, // Corrected from 'patient'
    });
    await this.installmentPaymentRepository.save(installment);

    return {
      message: 'Payment successful',
      transactionRef,
      paidAmount: patient.paidAmount,
      remainingBalance: patient.remainingBalance,
      checkoutUrl: paymentResponse.checkout_url,
    };
  }

  /**
   * Initiates a payment transaction with the PayChangu API.
   */
  async initiatePayment(amount: number, transactionRef: string): Promise<PaymentResponse> {
    try {
      const paymentData = {
        tx_ref: transactionRef,
        amount,
        currency: 'MWK',
        callback_url: 'https://your-website.com/payment-callback',
      };

      const response = await axios.post<PaymentResponse>(
        'https://api.paychangu.com/payment',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Payment API Response:', response.data);

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
   * Retrieves the remaining fee balance for all patients.
   */
  async getRemainingBalance() {
    const patients = await this.patientRepository.find();
    const transactionRef = `TX-${Date.now()}`;

    return patients.map(patient => ({
      transactionRef,
      medicalId: patient.medicalId,
      totalFees: patient.totalFees,
      paidAmount: patient.paidAmount,
      remainingBalance: patient.remainingBalance,
      isFullyPaid: patient.isFullyPaid,
    }));
  }

  /**
   * Retrieves the fee payment history for all patients.
   */
  async getPaymentHistory() {
    return this.installmentPaymentRepository.find({
      relations: ['hospitalFee'], // Corrected from 'patient'
      select: {
        id: true,
        amountPaid: true,
        transactionRef: true,
        hospitalFee: { medicalId: true, totalFees: true }, // Corrected from 'patient'
      },
    });
  }
}