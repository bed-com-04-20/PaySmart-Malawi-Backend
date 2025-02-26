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
                    },}
            ),
           
        );
        const data = response.data;

        if (data.status === 200) {
            return {
                statusCode: 200,
                message: 'Payment status fetched successfully',
                data: data.data,
            };
            
        } else {
            throw new HttpException(data.message || 'Failed to fetch payment status', HttpStatus.BAD_REQUEST);
            
        }
        
      } catch (error) {
        console.error('Error fetching payment status:', error.response?.data || error.message);
        throw new HttpException(
          error.response?.data?.message || 'An error occurred while fetching payment status.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        
      }
  
 }
 async verifyPayment(tx_ref:string,): Promise<any>{
    const apiKey = process.env.PAYCHANGUE_API_KEY;
    if (!apiKey) {
        throw new HttpException('API key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
        const response = await firstValueFrom(
            this.httpService.get(
                `https://api.paychangu.com/verify-payment/${tx_ref}`,{
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        accept: 'application/json',
                    },
                }
            ),
        );
        const data = response.data;

        if (data.status === 200) {
            return {
                statusCode: 200,
                message: 'Payment verified successfully',
                data: data.data,
            };
            
        } else {
            throw new HttpException(data.message || 'Failed to verify payment', HttpStatus.BAD_REQUEST);
            
        }
        
    } catch (error) {
        console.error('Error verifying payment:', error.response?.data || error.message);
        throw new HttpException(
          error.response?.data?.message || 'An error occurred while verifying payment.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        
    }
 }
 async initiatePayout(phoneNumber: string, amount: string): Promise<any> {
    const mobileMoneyOperatorRefId = this.getMobileOperatorRefId(phoneNumber);
    const chargeId = this.generateUniqueTransactionReference();

    const apiKey = process.env.PAYCHANGU_API_KEY;
    if (!apiKey) {
      throw new HttpException('API key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/mobile-money/payouts/initialize',
          {
            mobile: phoneNumber,
            mobile_money_operator_ref_id: mobileMoneyOperatorRefId,
            amount,
            charge_id: chargeId,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payout initiated successfully.',
          data: response.data.data,
        };
      } else {
        throw new HttpException('Failed to initiate mobile money payout.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error initiating payout:', error.response?.data || error.message);
      throw new HttpException(
        'An error occurred while processing payout.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
