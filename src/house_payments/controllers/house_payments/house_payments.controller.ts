import { Body, Controller, Post } from '@nestjs/common';
import { PaymentDTO } from 'src/DTO/house_payment.DTO';
import { HousePaymentsService } from 'src/house_payments/services/house_payments/house_payments.service';

@Controller('house-payments')
export class HousePaymentsController 
{
   constructor(
      private  readonly paymentService:HousePaymentsService 
   ){}

   @Post('pay-rent')
   async payRent(@Body() paymentDTO: PaymentDTO) {
       return this.paymentService.processHousePayment(paymentDTO);
   }
}
