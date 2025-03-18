
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private readonly rechargeRepository: Repository<RechargeEntity>,
    ) {}

    calculateUnits(serviceType: 'escom' | 'waterboard', amount: number): number {
        const rates = { escom: 1 / 200, waterboard: 1 / 100 };
        return amount * (rates[serviceType] || 0);
    }

    generateToken(): number {
        return Math.floor(100000000000000 + Math.random() * 900000000000000); // 15-digit number
    }

    private async verifyPayment(tx_ref: string): Promise<void> {
        try {
            const response = await axios.get<{ status: string }>( // <-- Explicitly define response type
                `https://api.paychangu.com/verify-payment/{tx_ref}
`, 
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                    },
                }
            );

            if (response.data.status !== 'success') {
                throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.error('Error verifying payment:', error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.message || 'Error verifying payment',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async processEscomRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'escom');
    }

    async processWaterboardRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'waterboard');
    }

     async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
        const { meterNo, amount, tx_ref } = dto;

        await this.verifyPayment(tx_ref);

        const units = this.calculateUnits(serviceType, amount);
        const token = this.generateToken(); // Now a number

        const recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units,
            token, // Now correctly stored as a number
        });

        const savedRecharge = await this.rechargeRepository.save(recharge);

        return {
            meterNo: savedRecharge.meterNo,
            amount: savedRecharge.amount,
            units,
            token: savedRecharge.token, // Ensure it remains a number
            rechargeDate: savedRecharge.rechargeDate,
            serviceType,
        };
    }

    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
}


