import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

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
        return Math.floor(100000000000000 + Math.random() * 900000000000000);
    }

    // Initiates payment via PayChangu
    // async initiatePayment(amount: number, transactionId: string): Promise<PaymentResponse> {
    //     try {
    //         const paymentData = {
    //             amount,
    //             currency: 'MWK',
    //             // Note: Callback is not used in this flow but is still provided to the API.
    //             callback_url: 'https://your-website.com/payment-callback',
    //         };

    //         const response = await axios.post<PaymentResponse>(
    //             'https://api.paychangu.com/payment',
    //             paymentData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );

    //         console.log('Payment API Response:', response.data);

    //         const checkoutUrl = response.data?.data?.checkout_url;
    //         if (checkoutUrl) {
    //             return { success: true, checkout_url: checkoutUrl };
    //         } else {
    //             console.error('Invalid response format:', response.data);
    //             return { success: false, message: 'Invalid response from payment API' };
    //         }
    //     } catch (error) {
    //         console.error('Payment error:', error.response?.data || error.message);
    //         return { success: false, message: error.response?.data || error.message };
    //     }
    // }
    async initiatePayment(amount: number, transactionRef: string): Promise<any> {
        try {
            // Define the payment data structure
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
                callback_url: 'https://your-website.com/payment-callback', // Add your callback URL here
            };

            // Define the expected response type for payment
            interface PaymentResponse {
                message: string;
                status: string;
                data: {
                    event: string;
                    checkout_url: string;
                    data: {
                        tx_ref: string;
                        currency: string;
                        amount: number;
                        mode: string;
                        status: string;
                    };
                };
            }

            // Send request to PayChangu API
            const response = await axios.post<PaymentResponse>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is loaded correctly
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Check if the response contains a valid checkout URL
            if (response.data && response.data.data && response.data.data.checkout_url) {
                return { success: true, checkout_url: response.data.data.checkout_url };
            } else {
                console.error('Invalid response format:', response.data);
                return { success: false, message: 'Invalid response from payment API' };
            }
        } catch (error) {
            console.error('Payment error:', error.response?.data || error.message);
            return { success: false, message: error.response?.data || error.message };
        }
    }

    // Process Recharge: Initiates and completes the recharge process in one go (no callback)
    async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
        const { meterNo, amount } = dto;
    
        // Check for any pending transaction
        let pendingTransaction = await this.rechargeRepository.findOne({
            where: { meterNo, serviceType, paymentStatus: 'pending' },
            order: { createdAt: 'DESC' },
        });
    
        // If a pending transaction exists, return its details
        if (pendingTransaction) {
            return {
                message: 'Pending transaction already exists',
                transactionId: pendingTransaction.id,
            };
        }
    
        // Create a new recharge record in a pending state.
        let recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units: 0,          // Will be calculated below.
            token: null as any, // Will be generated below.
            paymentStatus: 'pending',
            status: 'pending',
        });
        recharge = await this.rechargeRepository.save(recharge);
    
        // Initiate Payment.
        const paymentResponse = await this.initiatePayment(amount, recharge.id.toString());
        if (!paymentResponse.success) {
            throw new HttpException(
                'Payment initiation failed: ' + paymentResponse.message, 
                HttpStatus.BAD_REQUEST
            );
        }
    
        // Process the recharge immediately without a callback.
        const units = this.calculateUnits(serviceType, amount);
        const token = this.generateToken();
        recharge.units = units;
        recharge.token = token;
        recharge.status = 'completed';
        // Update the paymentStatus with an allowed enum value (e.g., "success").
      
        recharge.rechargeDate = new Date();
        await this.rechargeRepository.save(recharge);
    
        // Generate and return the transaction summary using the dedicated method.
        return this.generateTransactionSummary(recharge, paymentResponse.checkout_url);
    }
    
    // Generate a transaction summary using a separate method.
    generateTransactionSummary(recharge: RechargeEntity, paymentUrl?: string) {
        const date = recharge.rechargeDate ? new Date(recharge.rechargeDate) : new Date();
        return {
            transactionDate: date.toLocaleDateString(), // e.g., "MM/DD/YYYY"
            transactionTime: date.toLocaleTimeString(),   // e.g., "HH:MM:SS AM/PM"
            meterNo: recharge.meterNo,
            serviceType: recharge.serviceType,
            amount: recharge.amount,
            units: recharge.units,
            transactionId: recharge.id,
            accessToken: recharge.token,                  // Included as the access token.
            paymentUrl: paymentUrl,
        };
    }
    
    // Retrieve full recharge history for a service type.
    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
    
    // Retrieve recharge transaction summaries filtered by service type.
    async getRechargeHistorySummary(serviceType: 'escom' | 'waterboard'): Promise<any[]> {
        const transactions = await this.rechargeRepository.find({
            where: { serviceType, status: 'completed' },
            order: { rechargeDate: 'DESC' },
        });
        return transactions.map(transaction => this.generateTransactionSummary(transaction));
    }
  
    // Retrieve all recharge transaction summaries.
    async getAllRechargeSummaries(): Promise<any[]> {
        const transactions = await this.rechargeRepository.find({
            where: { status: 'completed' },
            order: { rechargeDate: 'DESC' },
        });
        return transactions.map(transaction => this.generateTransactionSummary(transaction));
    }
}
