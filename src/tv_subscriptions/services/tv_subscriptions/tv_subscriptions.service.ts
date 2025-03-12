import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVsubscription } from 'src/Entities/TVsubscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TvSubscriptionsService {

    constructor(
        @InjectRepository(TVsubscription)
        private readonly tvSubscriptionRepository: Repository<TVsubscription>,

        @InjectRepository(TvPackageEntity)
        private readonly tvPackageRepository: Repository<TvPackageEntity>
    ){}
    async listPackages(serviceId:number){
        return this.tvPackageRepository.find({ where:{id:serviceId}});
    }

    async processSubscription(dto:CreateSubscriptionDTO)
    {
       const {packageId, accountNumber} = dto;

       const packageData = await this.tvPackageRepository.findOne({where:{id:packageId}});

       if (!packageData) {
           throw new HttpException('package not found', HttpStatus.NOT_FOUND)
        
       }

       const transactionRef = `TX-${Date.now()}`;


       const paymentResponse = await this.initatePayment(packageData.price, transactionRef) as { success: boolean };
       if(!paymentResponse.success){
           throw new HttpException('payment failed', HttpStatus.BAD_REQUEST);

           

       }
       const subscription = this.tvSubscriptionRepository.create({
              accountNumber,
              packages:packageData,
              tx_ref:transactionRef,
              status:'success'
         })
         await this.tvSubscriptionRepository.save(subscription);

         return {
                message:'subscription successful',
                transactionRef,
                package:packageData.name,
                accountNumber,
                price:packageData.price
         }


       
    }
    async initatePayment(amount:number, transactionRef:string){
        try {
            const response = await axios.post(
              'https://api.paychangu.com/initiate-payment',
              {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
              },
              {
                headers: { Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}` },
              },
            );
      
            return response.data; // Assuming API returns { success: true/false }
          } catch (error) {
            console.error('Payment error:', error.response?.data || error.message);
            return { success: false };
          }
        }
        
    }

    

