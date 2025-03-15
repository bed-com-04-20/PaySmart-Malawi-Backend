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

@Injectable()
export class HousePaymentsService {
  constructor (
    @InjectRepository(HousePayment)
    private readonly housePaymentRepository: Repository<HousePayment>,

    @InjectRepository(InstallmentPayment)
    private readonly installmentPaymentRepository: Repository<InstallmentPayment>,
  ) {}

  /**
   * Records a house payment and initiates a transaction with PayChangu
   */
  async recordPayment(houseId: number, amountPaid: number) {
    const house = await this.housePaymentRepository.findOne({ where: { id: houseId } });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    if (!process.env.PAYCHANGU_API_KEY) {
      throw new HttpException("Payment API key is missing", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const transactionRef = `HOUSE-${houseId}-${Math.floor(Date.now() / 1000)}`;

    const paymentData = {
      tx_ref: transactionRef,
      amount: amountPaid,
      currency: "MWK",
      callback_url: "https://your-backend.com/payments/callback",
      return_url: "https://your-frontend.com/payment-success",
    };

    try {
      const response = await axios.post<{ checkout_url: string }>(
        "https://api.paychangu.com/payment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.checkout_url) {
        throw new HttpException("Invalid payment gateway response", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Record the installment payment
      const installmentPayment = this.installmentPaymentRepository.create({
        house,
        amountPaid,
      });
      await this.installmentPaymentRepository.save(installmentPayment);

      // Update the house payment record
      house.paidAmount += amountPaid;
      if (house.paidAmount >= house.price) {
        house.isFullyPaid = true;
      }
      await this.housePaymentRepository.save(house);

      return {
        message: "Payment recorded successfully",
        checkout_url: response.data.checkout_url, // Payment URL for the user
        remainingBalance: house.price - house.paidAmount,
      };
      
    } catch (error) {
      console.error("PayChangu Payment Error:", error.response?.data || error.message);
      throw new HttpException("Payment processing failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves the remaining balance for a house
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
   * Retrieves the payment history for a specific house
   */
  async getPaymentHistory(houseId: number) {
    return this.installmentPaymentRepository.find({
      where: { house: { id: houseId } },
      relations: ["house"], // Ensures only necessary relations are loaded
      select: {
        id: true,
        amountPaid: true,
        
        house: { id: true, price: true }, // Avoids loading full house object
      },
    });
  }

  /**
   * Finds a house by its Delta number
   */
  async getHouseByDelta(deltaNumber: number) {
    const house = await this.housePaymentRepository.findOne({ where: { deltaNumber } });

    if (!house) {
        throw new NotFoundException(`House with delta number ${deltaNumber} not found.`);
    }

    return house; // or return specific data like `return { houseId: house.id, price: house.price };`
}

}
