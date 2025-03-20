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
    async initiatePayment(amount: number, transactionId: string): Promise<PaymentResponse> {
        try {
            const paymentData = {
                amount,
                currency: 'MWK',
                callback_url: `https://your-server.com/api/recharges/payment-callback/${transactionId}`, // Callback for this transaction
            };

            const response = await axios.post<PaymentResponse>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
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

    // Step 1: Initiate Recharge - Returns Payment URL Only
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
        const recharge = this.rechargeRepository.create({
            serviceType: serviceType as 'escom' | 'waterboard', // Ensure correct type
            meterNo,
            amount,
            units: 0, // Will be calculated later
            token: null as any, // TypeORM workaround
            paymentStatus: 'pending',
            status: 'pending',
        });
        const savedRecharge = await this.rechargeRepository.save(recharge);
        // Initiate Payment
        const paymentResponse = await this.initiatePayment(amount,savedRecharge.id.toString());
    
        // Create new recharge record
        
    
   
    
        return {
            meterNo: savedRecharge.meterNo,
            amount: savedRecharge.amount,
            transactionId: savedRecharge.id,
            paymentUrl: paymentResponse.checkout_url,
        };
    }
    
    // Step 2: Payment Callback - Process Recharge Only After Payment Success
    async paymentCallback(transactionId: string, status: string) {
        // Find the pending transaction
        const transaction = await this.rechargeRepository.findOne({
            where: { id: transactionId, status: 'pending' },
        });

        if (!transaction || status !== 'success') {
            throw new HttpException('Invalid or failed payment', HttpStatus.BAD_REQUEST);
        }

        // Process Recharge
        const units = this.calculateUnits(transaction.serviceType, transaction.amount);
        const token = this.generateToken();

        // Update Transaction
        transaction.units = units;
        transaction.token = token;
        transaction.status = 'completed'; // Mark as completed
        transaction.rechargeDate = new Date();

        await this.rechargeRepository.save(transaction);

        // Return Recharge Details
        return {
            meterNo: transaction.meterNo,
            amount: transaction.amount,
            units,
            token,
            rechargeDate: transaction.rechargeDate,
            serviceType: transaction.serviceType,
        };
    }
}
