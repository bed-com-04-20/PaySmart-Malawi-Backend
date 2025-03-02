import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'crypto';
import { houseEntity } from 'src/Entities/House.Entity';
import { housePaymentEntity } from 'src/Entities/house_payments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HousePaymentsService {
    constructor (@InjectRepository(houseEntity)
    private readonly housepaymentsRepository: Repository<houseEntity>,

    @InjectRepository(housePaymentEntity)

    private readonly housePaymentRepository: Repository<housePaymentEntity>){

       
    }
    async verifyPayment(tx_ref:string):Promise<void>{
        try {
            const response = await axios.get(
               `https://api.paychangu.com/verify-payment/${tx_ref}`,
               {
                headers: {
                    Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                   
                },
               } 
            );
          
        } catch (error) {
            
        }
    }
}
