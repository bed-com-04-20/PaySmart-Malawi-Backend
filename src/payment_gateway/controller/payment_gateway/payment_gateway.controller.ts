import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitiatePayoutDto, PaymentsDto } from 'src/DTO/payment.DTO';
import { PaymentWayService } from 'src/payment_gateway/service/payment_way/payment_way.service';

@Controller('payment-gateway')
export class PaymentGatewayController {
    constructor (
        private readonly PaymentGatewayService: PaymentWayService
    ){

    }
    @Post('process-payment')
    async processPayment(@Body() PaymentsDto: PaymentsDto) {
        return await this.PaymentGatewayService.processPayment(PaymentsDto);
    }
    @Get('status/:tx_ref')
  async getPaymentStatus(@Param('tx_ref') tx_ref: string) {
    // Retrieves the status of the payment
    return this.PaymentGatewayService.getPaymentStatus(tx_ref);
  }
  @Get('verify/:tx_ref')
  async verifyPayment(@Param('tx_ref') tx_ref: string) {
    console.log("Verifying payment with tx_ref:", tx_ref);
    // Verifies the payment status
    return this.PaymentGatewayService.verifyPayment(tx_ref);
  }
  @Post('cash-out')
  async initiatePayout(@Body() body: InitiatePayoutDto) {
    const { phoneNumber, amount } = body;
    // Initiates the payout process for mobile money
    return await this.PaymentGatewayService.initiatePayout(phoneNumber, amount);
  }  
  @Post('payment-callback')
  async paymentCallback(@Body() paymentData: any) {
    console.log('Payment callback data received:', paymentData);

    const { tx_ref, status } = paymentData;

    // Handle the payment status update (e.g., save status to the database, notify the user, etc.)
    if (status === 'success') {
      // Handle success
      console.log(`Payment ${tx_ref} successful`);
      // You can perform actions like updating order status or notifying the user
    } else {
      // Handle failure
      console.log(`Payment ${tx_ref} failed`);
    }

    // Respond back to PayChangu (or any other payment service) to acknowledge receipt of the callback
    return { message: 'Callback received successfully.' };
  }

}

