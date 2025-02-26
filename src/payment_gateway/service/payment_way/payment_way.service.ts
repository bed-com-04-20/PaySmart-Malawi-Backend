import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { PaymentsDto } from 'src/DTO/payment.DTO';

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

    const apikey = process.env.PAYCHANGUE_API_KEY;
    if (!apikey) {
        throw new HttpException('PayChanger API key not found', HttpStatus.INTERNAL_SERVER_ERROR)
        
    }
    

 }
}
