import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private rechargeRepository: Repository<RechargeEntity>,
    ){}

    // calculate units
    calculateUnits(serviceType:'escom' | 'waterboard', amount:number) :number {
        // Example calculation logic
       const rates ={
        escom: 0.2,
        waterboard: 0.3
       };
         return amount * rates[serviceType];
    };

    // generate a random token
    generateToken():string{
        return crypto.randomBytes(8).toString('hex').toUpperCase();

    }
}
