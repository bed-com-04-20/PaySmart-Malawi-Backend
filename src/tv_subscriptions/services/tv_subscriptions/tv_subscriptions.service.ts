import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVsubscription } from 'src/Entities/TVsubscription.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class TvSubscriptionsService {

    constructor(
        @InjectRepository(TVsubscription)
        private readonly tvSubscriptionRepository: Repository<TVsubscription>,

        @InjectRepository(TvPackageEntity)
        private readonly tvPackageRepository: Repository<TvPackageEntity>
    ){}
    async listPackages() :Promise<TvPackageEntity[]> {
        return this.tvPackageRepository.find();
    }

    async processSubscription(dto:CreateSubscriptionDTO)
    {
       const {packageId, accountNumber} = dto;

       const packageData = await this.tvPackageRepository.findOne({where:{id:packageId}});

       if (!packageData) {
           throw new HttpException('package not found', HttpStatus.NOT_FOUND)
        
       }

       const transactionRef = `TX-${Date.now()}`;


       const paymentResponse = await this.initiatePayment(packageData.price, transactionRef) as { success: boolean };
       if(!paymentResponse.success){
           return {message: 'subscription succesifull'}

           

       }
       const subscription = this.tvSubscriptionRepository.create({
              accountNumber,
              packages:[packageData],
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
    async initiatePayment(amount: number, transactionRef: string): Promise<any> {
        try {
            // Construct payment data
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
                callback_url: 'https://your-website.com/payment-callback', // Add your callback URL here
            };
    
            // Send request to PayChangu API
            interface PaymentResponse {
                checkout_url?: string;
            }

            const response = await axios.post<PaymentResponse>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is loaded correctly
                        'Content-Type': 'application/json', // Explicit content type
                    },
                },
            );
    
            if (response.data && response.data.checkout_url) {
                // Return success with checkout URL if available
                return { success: true, checkout_url: response.data.checkout_url };
            } else {
                // Handle case where response doesn't return the expected data
                console.error('Invalid response format:', response.data);
                return { success: false, message: 'Invalid response from payment API' };
            }
        } catch (error) {
            // Handle any errors from the request
            console.error('Payment error:', error.response?.data || error.message);
            return { success: false, message: error.response?.data || error.message };
        }
    }
}    
    

