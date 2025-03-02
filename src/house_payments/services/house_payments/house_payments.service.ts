import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'crypto';
import { PaymentDTO } from 'src/DTO/house_payment.DTO';
import { houseEntity } from 'src/Entities/House.Entity';
import { housePaymentEntity } from 'src/Entities/house_payments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HousePaymentsService {
    constructor (@InjectRepository(houseEntity)
    private readonly houseRepository: Repository<houseEntity>,

    @InjectRepository(housePaymentEntity)

    private readonly housePayment: Repository<housePaymentEntity>){

       
    }
    async verifyPayment(tx_ref:string):Promise<boolean>{
        try {
            const response = await axios.get<{status:string}>(
               `https://api.paychangu.com/verify-payment/${tx_ref}`,
               {
                headers: {
                    Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
                   
                },
               } 
            );
          return response.data.status === 'success'
        } catch (error) {
            console.error('Payment verification error:', error.response?.data || error.message);
            throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
            
        }
    }
    async processHousePayment(dto:PaymentDTO) {
        const { houseId, amount, payerName, tx_ref } = dto;

        const house = await this.housePayment.findOne({where: {houseId}});
        if (!house) {
            throw new HttpException('House not found', HttpStatus.NOT_FOUND);
        }

        const isPaymentValid = await this.verifyPayment(tx_ref)
        if (!isPaymentValid) {
            throw new HttpException('Invalid payment', HttpStatus.BAD_REQUEST);
        }

        house.balance -= amount;

        if(house.balance< 0) house.balance = 0;

        await this.houseRepository.save(house);

        const payment = this.housePayment.create({
            house,
            amountPaid: amount,
            payerName,
            tx_ref,
            status: 'successful',
          
        });
        await this.housePayment.save(payment)

        return {message : 'payment successful', remainingBalance: house.balance }

    }
}
