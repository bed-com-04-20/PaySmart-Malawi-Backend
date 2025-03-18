import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

// Export PaymentResponse interface so it can be used in other files
export interface PaymentResponse {
    success: boolean;
    checkout_url?: string;
    message?: string;
    data?: {
        checkout_url?: string;
    };
}

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private readonly rechargeRepository: Repository<RechargeEntity>,
    ) {}

    // Calculate units based on service type and amount
    calculateUnits(serviceType: 'escom' | 'waterboard', amount: number): number {
        const rates = { escom: 1 / 200, waterboard: 1 / 100 };
        return amount * (rates[serviceType] || 0);
    }

    // Generate a 15-digit token
    generateToken(): number {
        return Math.floor(100000000000000 + Math.random() * 900000000000000); // 15-digit number
    }

    // Initiates payment by interacting with PayChangu API
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
                // Handle case where response doesn't return the expected data
                console.error('Invalid response format:', response.data);
                return { success: false, message: 'Invalid response from payment API' };
            }
        } catch (error) {
            // Handle any errors from the request
            console.error('Payment error:', error.response?.data || error.message);
            return { success: false, message: error.response?.data || error.message };
        }
    }

    // Processes an Escom recharge request
    async processEscomRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'escom');
    }

    // Processes a Waterboard recharge request
    async processWaterboardRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'waterboard');
    }

    // Common recharge processing logic for both services
    async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
        const { meterNo, amount } = dto;
    
        // Calculate units and generate token
        const units = this.calculateUnits(serviceType, amount);
        const token = this.generateToken();
    
        // Create recharge entry
        const recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units,
            token,
        });
    
        // Save to DB (tx_ref will be auto-generated)
        const savedRecharge = await this.rechargeRepository.save(recharge);
    
        return {
            meterNo: savedRecharge.meterNo,
            amount: savedRecharge.amount,
            units,
            token: savedRecharge.token,
            rechargeDate: savedRecharge.rechargeDate,
            serviceType,
            tx_ref: savedRecharge.tx_ref, // Include auto-generated tx_ref in response
        };
    }
    

    // Fetches recharge history for a specific service type
    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
}
