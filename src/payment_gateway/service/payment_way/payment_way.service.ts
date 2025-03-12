import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { PaymentsDto } from 'src/DTO/payment.DTO';
import { firstValueFrom } from 'rxjs';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentWayService {
    
    private readonly operatorRefIds = {
        '8': '27494cb5-ba9e-437f-a114-4e7a7686bcca',
        '9': '20be6c20-adeb-4b5b-a7ba-0769820df4fb',
    };

    constructor(
        @InjectRepository(RechargeEntity)
        private rechargeRepository: Repository<RechargeEntity>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    private getMobileOperatorRefId(mobile: string): string {
        const prefix = mobile.charAt(0);
        const refId = this.operatorRefIds[prefix];

        if (!refId) {
            throw new HttpException('Unsupported mobile number prefix', HttpStatus.BAD_REQUEST);
        }
        return refId;
    }

    private generateUniqueTransactionReference(): string {
        return uuidv4();
    }

    async processPayment(
        amount: number,
        currency: string,
        meterNo: number,
        serviceType: 'escom' | 'waterboard',
        email: string,
        phoneNumber: number,
        name: string,
       
    ): Promise<any> {
        const tx_ref = this.generateUniqueTransactionReference();
        const recharge = this.rechargeRepository.create({
            meterNo,
            serviceType,
            amount,
            tx_ref,
            status: 'pending',
        });
       
        await this.rechargeRepository.save(recharge);
    
        const paymentData = {
            amount,
            currency,
            email,
            name,
            tx_ref,
            phone_number: phoneNumber,
            callback_url: 'https://6e31-41-70-44-187.ngrok-free.app/custom-recharges/escom/recharge',
            return_url: 'https://your-frontend.com/payment-success'
        };
    
        try {
            // Ensure the secret key is set in the environment variables
            const secretKey = process.env.PAYCHANGU_API_KEY;
    
            if (!secretKey) {
                console.error("Missing PAYCHANGU_SECRET_KEY in environment variables.");
                throw new HttpException('Payment service configuration error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    
            const response = await axios.post<{ checkout_url: string }>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                         
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${secretKey}`,  // Include secret key here
                    }
                }
            );
            console.log("✅ PayChangu Response:", response.data);
            return { checkout_url: response.data.checkout_url, tx_ref };
        } catch (error) {
            console.error('Error processing payment:', error.response?.data || error.message);
            throw new HttpException('Failed to process payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getPaymentStatus(tx_ref: string): Promise<any> {
        const apiKey = this.configService.get<string>('PAYCHANGU_API_KEY');
        if (!apiKey) {
            throw new HttpException('API key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get(`https://api.paychangu.com/payment/status/${tx_ref}`, {
                    headers: { Authorization: `Bearer ${apiKey}` },
                })
            );

            if (response.data.status === 'success') {
                return {
                    statusCode: 200,
                    message: 'Payment status fetched successfully',
                    data: response.data.data,
                };
            } else {
                throw new HttpException(response.data.message || 'Failed to fetch payment status', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.error('Error fetching payment status:', error.response?.data || error.message);
            throw new HttpException('An error occurred while fetching payment status.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyPayment(tx_ref: string): Promise<any> {
        const apiKey = this.configService.get<string>('PAYCHANGU_API_KEY');
        if (!apiKey) {
            throw new HttpException('API key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        accept: 'application/json',
                    },
                })
            );

            if (response.data.status === 'success') {
                return {
                    statusCode: 200,
                    message: 'Payment verified successfully',
                    data: response.data.data,
                };
            } else {
                throw new HttpException(response.data.message || 'Failed to verify payment', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.error('Error verifying payment:', error.response?.data || error.message);
            throw new HttpException('An error occurred while verifying payment.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async initiatePayout(phoneNumber: string, amount: string): Promise<any> {
        const mobileMoneyOperatorRefId = this.getMobileOperatorRefId(phoneNumber);
        const chargeId = this.generateUniqueTransactionReference();
        const apiKey = this.configService.get<string>('PAYCHANGU_API_KEY');

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
                    }
                )
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
            throw new HttpException('An error occurred while processing payout.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async handlePaymentCallback(paymentData: any): Promise<any> {
        //
        try {
            const { tx_ref, status, amount, meterNo, rechargeDate, token, units, serviceType } = paymentData;

            if ( status !== 'success' ) {
                console.warn('payment failed for tx_ref: ${tx_ref}' );
                return { message: 'payment failed', tx_ref}
                
            }
            console.log('payment successful for Meter No: ${meterNo}');
            console.log('Amount: ${amount}, units: ${units}, Token: ${token}');

            return{ message: 'payment successful', tx_ref, amount, meterNo,rechargeDate, token, units, serviceType};
        } catch (error) {
            console.error('Error processing payment callback', error);

            throw new Error('Error processing payment callback')
            
        }
    }
    
}
