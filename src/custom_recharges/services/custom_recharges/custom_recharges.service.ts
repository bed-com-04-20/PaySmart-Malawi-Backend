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

    async initiatePayment(amount: number, transactionRef: string): Promise<any> {
        try {
            // Payment data without callback_url
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
                callback_url: 'https://your-website.com/payment-callback'
            };

            // Payment response structure
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
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Return checkout URL
            if (response.data?.data?.checkout_url) {
                return { 
                    success: true, 
                    checkout_url: response.data.data.checkout_url 
                };
            }
            throw new Error('Invalid payment API response');
            
        } catch (error) {
            console.error('Payment error:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data || error.message 
            };
        }
    }

    // Process Recharge: Initiate payment and return checkout URL
    async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
        const { meterNo, amount } = dto;
    
        // Check for pending transactions
        const pendingTransaction = await this.rechargeRepository.findOne({
            where: { meterNo, serviceType, paymentStatus: 'pending' },
            order: { createdAt: 'DESC' },
        });
    
        if (pendingTransaction) {
            return {
                message: 'Pending transaction exists',
                transactionId: pendingTransaction.id,
            };
        }
    
        // Calculate units and generate token **before saving**
        const calculatedUnits = this.calculateUnits(serviceType, amount);
        const generatedToken = this.generateToken();
    
        let recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units: calculatedUnits,
            token: generatedToken,
            paymentStatus: 'pending',
            status: 'pending',
        });
        recharge = await this.rechargeRepository.save(recharge);
    
        // Initiate payment and get checkout URL
        const paymentResponse = await this.initiatePayment(amount, recharge.id.toString());
        if (!paymentResponse.success) {
            throw new HttpException(
                `Payment failed: ${paymentResponse.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    
        // Return payment information to frontend
        return {
            success: true,
            checkout_url: paymentResponse.checkout_url,
            transactionId: recharge.id,
            units: recharge.units,           // Include units in response
            token: recharge.token,           // Include token in response
        };
    }
    
    // Confirm and complete payment (to be called after successful payment)
    async confirmPayment(transactionId: string) {
        const recharge = await this.rechargeRepository.findOneBy({ id: transactionId });
        
        if (!recharge) {
            throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
        }

        // Process the recharge
        recharge.units = this.calculateUnits(recharge.serviceType, recharge.amount);
        recharge.token = this.generateToken();
        recharge.paymentStatus = 'success';
        recharge.status = 'completed';
        recharge.rechargeDate = new Date();
        
        await this.rechargeRepository.save(recharge);
        
        return this.generateTransactionSummary(recharge);
    }

    // Generate transaction summary
    private generateTransactionSummary(recharge: RechargeEntity) {
        return {
            transactionDate: recharge.rechargeDate.toLocaleDateString(),
            transactionTime: recharge.rechargeDate.toLocaleTimeString(),
            meterNo: recharge.meterNo,
            serviceType: recharge.serviceType,
            amount: recharge.amount,
            units: recharge.units,
            transactionId: recharge.id,
            accessToken: recharge.token,
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
        async getRechargeHistorySummary(): Promise<any[]> {
            const transactions = await this.rechargeRepository.find({
                where: { status: 'completed' },
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