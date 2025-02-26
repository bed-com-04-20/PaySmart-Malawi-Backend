import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitiatePayoutDto, PaymentsDto } from 'src/DTO/payment.DTO';
import { PaymentWayService } from 'src/payment_gateway/service/payment_way/payment_way.service';

@Controller('payment-gateway')
export class PaymentGatewayController {
    constructor(private readonly paymentGatewayService: PaymentWayService) {}

    @Post('process-payment')
    async processPayment(@Body() paymentsDto: PaymentsDto) {
        return await this.paymentGatewayService.processPayment(
            paymentsDto.amount,
            paymentsDto.currency,
            paymentsDto.meterNo,
            paymentsDto.serviceType,
            paymentsDto.email,
            paymentsDto.phoneNumber!,
            paymentsDto.name,
            paymentsDto.tx_ref,
        );
    }

    @Get('status/:tx_ref')
    async getPaymentStatus(@Param('tx_ref') tx_ref: string) {
        return this.paymentGatewayService.getPaymentStatus(tx_ref);
    }

    @Get('verify/:tx_ref')
    async verifyPayment(@Param('tx_ref') tx_ref: string) {
        console.log('Verifying payment with tx_ref:', tx_ref);
        return this.paymentGatewayService.verifyPayment(tx_ref);
    }

    @Post('cash-out')
    async initiatePayout(@Body() body: InitiatePayoutDto) {
        const { phoneNumber, amount } = body;
        return await this.paymentGatewayService.initiatePayout(phoneNumber, amount);
    }

    @Post('payment-callback')
    async paymentCallback(@Body() paymentData: any) {
        console.log('Payment callback data received:', paymentData);

        const { tx_ref, status } = paymentData;

        if (status === 'success') {
            console.log(`Payment ${tx_ref} successful`);
            // Handle successful payment logic here (e.g., updating order status)
        } else {
            console.log(`Payment ${tx_ref} failed`);
            // Handle failed payment logic here
        }

        return { message: 'Callback received successfully.' };
    }
}
