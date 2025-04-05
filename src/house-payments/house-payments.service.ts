import { 
  HttpException, 
  HttpStatus, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { HousePayment } from './entities/house-payment.entity';
import { InstallmentPayment } from './entities/installmentPayment';
import { CreateHousePaymentDto } from './dto/create-house-payment.dto';
import { UpdateHousePaymentDto } from './dto/update-house-payment.dto';

interface PaymentResponse {
  success: boolean;
  checkout_url?: string;
  message?: string;
  data?: {
    checkout_url?: string;
  };
  
}

@Injectable()
export class HousePaymentsService {
  constructor (
    @InjectRepository(HousePayment)
    private readonly housePaymentRepository: Repository<HousePayment>,

    @InjectRepository(InstallmentPayment)
    private readonly installmentPaymentRepository: Repository<InstallmentPayment>,
  ) {}

  /**
   * Records a house payment, creates an installment record,
   * and initiates a transaction with PayChangu.
   */
  async recordPayment(dto: CreateHousePaymentDto) {
    const { houseId, amount } = dto;

    // Find the house payment record by houseId
    const house = await this.housePaymentRepository.findOne({ where: { id: houseId } });
    if (!house) {
      throw new HttpException('House not found', HttpStatus.NOT_FOUND);
    }

    // Validate amount
    if (!amount || amount <= 0) {
      throw new HttpException('Amount must be greater than zero', HttpStatus.BAD_REQUEST);
    }

    // Update the house payment record:
    // 1. Add the new payment to the existing paidAmount.
    // 2. Recalculate the remaining balance.
    // 3. Determine if the house is fully paid.
    house.paidAmount += amount;
    house.remainingBalance = house.price - house.paidAmount;
    house.isFullyPaid = house.remainingBalance <= 0;

    // Save the updated house record
    await this.housePaymentRepository.save(house);

    // Generate a transaction reference
    const transactionRef = `TX-${Date.now()}`;

    // Initiate payment process with external API
    const paymentResponse = await this.initiatePayment(amount, transactionRef);
    if (!paymentResponse.success) {
      throw new HttpException(paymentResponse.message || 'Payment failed', HttpStatus.BAD_REQUEST);
    }

    // Create and save an installment payment record for payment history
    const installment = this.installmentPaymentRepository.create({
      amountPaid: amount,
      // Ensure your InstallmentPayment entity has this field if needed
      house: house, // Associate the installment with the house payment record
    });
    await this.installmentPaymentRepository.save(installment);

    return {
      message: 'Payment successful',
      transactionRef,
      paidAmount: house.paidAmount,
      remainingBalance: house.remainingBalance,
      checkoutUrl: paymentResponse.checkout_url,
    };
  }

  /**
   * Function to interact with PayChangu API.
   */
  async initiatePayment(amount: number, transactionRef: string): Promise<PaymentResponse> {
    try {
      // Construct payment data
      const paymentData = {
        tx_ref: transactionRef,
        amount,
        currency: 'MWK', // Malawian Kwacha
        callback_url: 'https://your-website.com/payment-callback', // Add your callback URL
      };

      // Send request to PayChangu API
      const response = await axios.post<PaymentResponse>(
        'https://api.paychangu.com/payment',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is loaded correctly
            'Content-Type': 'application/json', // Explicit content type
          },
        }
      );

      // Log the entire response for debugging purposes
      console.log('Payment API Response:', response.data);

      // Access checkout_url from the nested structure
      const checkoutUrl = response.data?.data?.checkout_url;

      // Check if the checkout_url exists
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
   * Retrieves the remaining balance for a house.
   */
  async getRemainingBalance(houseId: number) {
    const house = await this.housePaymentRepository.findOne({ where: { id: houseId } });
    if (!house) {
      throw new HttpException("House not found", HttpStatus.NOT_FOUND);
    }

    return {
      houseId: house.id,
      totalPrice: house.price,
      paidAmount: house.paidAmount,
      remainingBalance: house.price - house.paidAmount,
      isFullyPaid: house.isFullyPaid,
    };
  }

  /**
   * Retrieves the payment history for a specific house.
   */
  async getPaymentHistory(houseId: number) {
    return this.installmentPaymentRepository.find({
      where: { house: { id: houseId } },
      relations: ["house"], // Ensures only necessary relations are loaded
      select: {
        id: true,
        amountPaid: true,
        house: { id: true, price: true },
      },
    });
  }

  /**
   * Finds a house by its Delta number.
   */
  async getHouseByDelta(deltaNumber: number) {
    const house = await this.housePaymentRepository.findOne({ where: { deltaNumber } });
    if (!house) {
      throw new NotFoundException(`House with delta number ${deltaNumber} not found.`);
    }
    return house;
  }
}
