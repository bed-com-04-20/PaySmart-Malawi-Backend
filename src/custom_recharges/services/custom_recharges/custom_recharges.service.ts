import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private rechargeRepository: Repository<RechargeEntity>,
    ){}

    // calculate units
    // calculateUnits(serviceType:'escom' | 'waterboard', amount:number) :number {
    //     // Example calculation logic
    //    const rates ={
    //     escom: 0.2,
    //     waterboard: 0.3
    //    };
    //      return amount * rates[serviceType];
    // };

    calculateUnits(serviceType: string, amount: number): number {
        if (serviceType === 'escom') return amount /200;
        if (serviceType === 'waterboard') return amount /100;
        return 0;

    }

    // generate a random token
    // Generate a numeric recharge token (6-digit number)
private generateToken(): number {
    return Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
  }

  async verifyPayment(tx_ref: string) :Promise<any>{
    try {
        const response = await axios.get(`https://api.paychangu.com/payment/verify/${tx_ref}`,{
            headers:{
                Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`
            },
        });

        return response.data;
        
    } catch (error) {
        console.error('Error verifying payment:', error.response?.data || error.message);
        return null

        
    }

  }
  

    // async processRecharge(
    //     serviceType: 'escom' | 'waterboard',
    //     accountIdentifier: string,
    //     amount: number,
    // ): Promise<RechargeEntity> {
    //     const units = this.calculateUnits(serviceType, amount);
    //     const token = this.generateToken();

    //     const recharge = this.rechargeRepository.create({
    //         serviceType,
    //         accountIdentifier,
    //         amount,
    //         units,
    //         token,
    //     });

    //     return this.rechargeRepository.save(recharge);
        

    // }
    async processRecharge( dto: rechargeDTO) : Promise<{meterNo: number, amount: number, units: number, token: number, rechargeDate: Date}> {
        const {meterNo, amount, serviceType, tx_ref} = dto;
         const units = this.calculateUnits(serviceType, amount,);
         const token = this.generateToken();

        //verifying payments
        const paymentStatus = await this.verifyPayment(tx_ref);

        if(!paymentStatus || paymentStatus.status !== 'success'){
            throw new HttpException('Payment verification failed',
                 HttpStatus.BAD_REQUEST);
        }

        const recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units,
            token,
            
        });

    const savedRecharge =    await this.rechargeRepository.save(recharge);
        return {
            meterNo:savedRecharge.meterNo,
            amount:savedRecharge.amount,
            units,
            token,
            rechargeDate: savedRecharge.rechargeDate

        
        };

    }
    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
    
}
