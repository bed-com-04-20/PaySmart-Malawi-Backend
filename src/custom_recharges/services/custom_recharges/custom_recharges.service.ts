import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';

import { RechargeEntity } from 'src/Entities/recharge.entity';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private readonly rechargeRepository: Repository<RechargeEntity>,
    ) {}

    /**
     * Calculates the number of units based on the service type and amount.
     */
     calculateUnits(serviceType: 'escom' | 'waterboard', amount: number): number {
        const rates: Record<'escom' | 'waterboard', number> = {
            escom: 1 / 200,
            waterboard: 1 / 100,
        };
        return amount * rates[serviceType] || 0;
    }

    /**
     * Generates a random 6-digit recharge token.
     */
    private generateToken(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

    /**
     * Verifies payment status from PayChangu.
     */
     async verifyPayment(tx_ref: string): Promise<any> {
        try {
            const response = await axios.get<{ status: string; data: any }>(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                },
            });

            if (response.data.status !== 'success') {
                throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
            }

            return response.data;
        } catch (error) {
            console.error('Error verifying payment:', error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.message || 'Error verifying payment',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Processes a recharge transaction.
     */
    async processRecharge(dto: rechargeDTO): Promise<{
        meterNo: number;
        amount: number;
        units: number;
        token: number;
        rechargeDate: Date;
    }> {
        const { meterNo, amount, serviceType, tx_ref } = dto;

        // Verify payment before proceeding
        await this.verifyPayment(tx_ref);

        // Calculate units and generate a token
        const units = this.calculateUnits(serviceType, amount);
        const token = this.generateToken();

        // Save the recharge transaction
        const recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units,
            token,
        });

        const savedRecharge = await this.rechargeRepository.save(recharge);

        return {
            meterNo: savedRecharge.meterNo,
            amount: savedRecharge.amount,
            units,
            token,
            rechargeDate: savedRecharge.rechargeDate,
        };
    }

    /**
     * Retrieves recharge history filtered by service type.
     */
    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
}
