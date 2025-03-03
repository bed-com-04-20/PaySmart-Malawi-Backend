import { Body, Controller, Get, Param, Post, Query, Headers } from "@nestjs/common";
import { InitiatePayoutDto, PaymentsDto } from "src/DTO/payment.DTO";
import { PaymentWayService } from "src/payment_gateway/service/payment_way/payment_way.service";

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

  

    @Post('custom-recharges/escom/recharge')
    async handlePaymentCallback(@Body() paymentData: any, @Query() query: any, @Headers() headers: Record<string, any>) {
        console.log("Payment callback received with body:", paymentData);
        console.log("Query parameters:", query);
        console.log("Headers:", headers);
        return this.paymentGatewayService.handlePaymentCallback(paymentData);
    }


    
}
