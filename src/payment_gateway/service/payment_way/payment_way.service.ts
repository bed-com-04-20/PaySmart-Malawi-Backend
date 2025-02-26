import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { PaymentsDto } from 'src/DTO/payment.DTO';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentWayService {
    constructor(
      private readonly httpService: HttpService,
    ){}

    private readonly operatorRefIds = {
        '8': '27494cb5-ba9e-437f-a114-4e7a7686bcca',
        '9': '20be6c20-adeb-4b5b-a7ba-0769820df4fb',
    }

    private getMobileOperatorRefId(mobile:string){
        const prefix = mobile.charAt(0)
        const refId = this.operatorRefIds[prefix

        ]
        if (!refId) {
            throw new HttpException('unsupported mobile number prefix', HttpStatus.BAD_REQUEST)
            
        }
        return refId;

    }
    private generateUniqueTransactionReference(): string{
        return uuidv4()
 }

 async processPayment( PaymentsDto :PaymentsDto):Promise<any>{
    const { amount, name} = PaymentsDto;

    PaymentsDto.tx_ref = this.generateUniqueTransactionReference();

    const apiKey = process.env.PAYCHANGUE_API_KEY;
    if (!apiKey) {
        throw new HttpException('PayChanger API key not found', HttpStatus.INTERNAL_SERVER_ERROR)
        
    }
    const options = {
        headers :{
            accept : 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        }
    };

    try {
        const response = await firstValueFrom(
            this.httpService.post(
                'https://api.paychangu.com/payment',
                {
                    ...PaymentsDto,
                    callback_url:'${process.env.BASE_URL}',
                    return_url:'${process.env.BASE_URL}',
                    currency: 'MWK',
                    email:'zarilasam99@gmail.com',
                    description:name,
                    amount:amount,
                },
                options,

            )
        );
        const data = response.data;

        if (data.status === 'success') {
            return {
                statusCode:200,
                message:'payment initiated successfully',
                data: data.data
            };
            
        } else {
            throw new HttpException(data.message || 'payment initiation failed', HttpStatus.BAD_REQUEST);
            
            
        }
        
    } catch (error) {
        console.error('Error processing payment:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'An error occurred while processing payment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
 }
  

 }
 async getPaymentStatus(tx_ref:string):Promise<any>{
    const apiKey = process.env.PAYCHANGUE_API_KEY;

    if (!apiKey) {
        throw new HttpException('API key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      try {
        const response = await firstValueFrom(
            this.httpService.get(
                `https://api.paychangu.com/payment/status/${tx_ref}`,{
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            )
        )
        
      } catch (error) {
        console.error('Error fetching payment status:', error.response?.data || error.message);
        throw new HttpException(
          error.response?.data?.message || 'An error occurred while fetching payment status.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        
      }
  
 }
}
