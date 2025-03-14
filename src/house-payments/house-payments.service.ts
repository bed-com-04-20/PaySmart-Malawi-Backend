import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHousePaymentDto } from './dto/create-house-payment.dto';
import { UpdateHousePaymentDto } from './dto/update-house-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HousePayment } from './entities/installmentPayment';
import { Repository } from 'typeorm';
import { InstallmentPayment } from './entities/house-payment.entity';

@Injectable()
export class HousePaymentsService {
  constructor (
    @InjectRepository(HousePayment)
    private readonly housePaymentRepository: Repository<HousePayment>,

    @InjectRepository(InstallmentPayment)
    private readonly installmentPaymentRepository: Repository<InstallmentPayment>,
     ){}
     async recordPayment(houseId:number, amountPaid:number){
      const house = await this.housePaymentRepository.findOne({
        where :{id:houseId}
      });

      if (!house) {
        throw new NotFoundException('House not found')
        
      }
      const transactionRef = `HOUSE-${houseId}-${Date.now()}`;

      const paymentData = {
        tx_ref : transactionRef,
        amount: amountPaid,
        currency: "MWK",
        callback_url: "https://your-backend.com/payments/callback",
        return_url: "https://your-frontend.com/payment-success",
      };

      try {
        const response = await axios.post<{checkout_url: string}>(
          "https://api.paychangu.com/payment",
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const installmentPayment = this.installmentPaymentRepository.create({
          house,
          amountPaid
        });
       await this.installmentPaymentRepository.save(installmentPayment);

        house.paidAmount += amountPaid;

        if (house.paidAmount>= house.price) {
          house.isFullyPaid = true;
          
        }
        await this.housePaymentRepository.save(house);

        return {
          message: "Payment recorded successfully",
          checkout_url: response.data.checkout_url, // Return checkout URL for user
          remainingBalance: house.price - house.paidAmount,
        }
        
      } catch (error) {
        console.error("PayChangu Payment Error:", error.response?.data || error.message);
        throw new HttpException("Payment processing failed", HttpStatus.INTERNAL_SERVER_ERROR);
        
      }

     

     }
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

  async getPaymentHistory(houseId: number) {
      return this.installmentPaymentRepository.find({
          where: { house: { id: houseId } },
          relations: ["house"],
      });
  }

  async getHouseByDelta(deltaNumber: number) {
      return await this.housePaymentRepository.findOne({ where: { deltaNumber } });
  }
    
    
    }

