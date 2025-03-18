 import { 
    Body, Controller, Get, Param, Post, Query, Headers, Req, 
    HttpException, HttpStatus 
} from "@nestjs/common";
import { InitiatePayoutDto, PaymentsDto } from "src/DTO/payment.DTO";
import { PaymentWayService } from "src/payment_gateway/service/payment_way/payment_way.service";
import * as crypto from 'crypto';

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
    async handlePaymentCallback(@Req() request: any, @Headers('signature') signature: string) {
        try {
            if (!signature) {
                throw new HttpException('Missing signature header', HttpStatus.BAD_REQUEST);
            }

            const rawBody = request.rawBody; 
            const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET || '';

            const computedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(rawBody)
                .digest('hex');

            if (computedSignature !== signature) {
                throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
            }

            const webhookData = JSON.parse(rawBody);
            console.log('✅ Received valid webhook:', webhookData);

            // Process the webhook data (Store in DB, trigger actions, etc.)
            return { message: 'Webhook processed successfully', data: webhookData };

        } catch (error) {
            console.error('❌ Error processing webhook:', error.message);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
