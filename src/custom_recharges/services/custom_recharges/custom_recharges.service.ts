// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import axios from 'axios';
// import { RechargeEntity } from 'src/Entities/recharge.entity';
// import { rechargeDTO } from 'src/DTO/Recharge.DTO';

// @Injectable()
// export class CustomRechargesService {
//     constructor(
//         @InjectRepository(RechargeEntity)
//         private readonly rechargeRepository: Repository<RechargeEntity>,
//     ) {}

//     /**
//      * Calculates units based on service type and amount
//      */
//     calculateUnits(serviceType: 'escom' | 'waterboard', amount: number): number {
//         const rates = { escom: 1 / 200, waterboard: 1 / 100 };
//         return amount * (rates[serviceType] || 0);
//     }

//     /**
//      * Generates a 15-digit token
//      */
//     generateToken(): number {
//         return Math.floor(100000000000000 + Math.random() * 900000000000000);
//     }

//     /**
//      * Verifies a payment transaction with PayChangu API
//      */
//     private async verifyPayment(tx_ref: string): Promise<void> {
//         try {
//             const url = `https://api.paychangu.com/verify-payment/${tx_ref}`; // Corrected dynamic endpoint
//             console.log(`Verifying payment for tx_ref: ${tx_ref}`); // Debugging log

//             const response = await axios.get<{ status: string }>(url, {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             console.log("Payment Verification Response:", response.data); // Log response for debugging

//             if (response.data.status !== 'success') {
//                 throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
//             }
//         } catch (error) {
//             console.error('Error verifying payment:', error.response?.data || error.message);
//             throw new HttpException(
//                 error.response?.data?.message || 'Error verifying payment',
//                 HttpStatus.INTERNAL_SERVER_ERROR
//             );
//         }
//     }

//     /**
//      * Processes an Escom recharge
//      */
//     async processEscomRecharge(dto: rechargeDTO) {
//         return this.processRecharge(dto, 'escom');
//     }

//     /**
//      * Processes a Waterboard recharge
//      */
//     async processWaterboardRecharge(dto: rechargeDTO) {
//         return this.processRecharge(dto, 'waterboard');
//     }

//     /**
//      * Processes a recharge request
//      */
//     async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
//         const { meterNo, amount, tx_ref } = dto;

//         await this.verifyPayment(tx_ref); // Verify payment before proceeding

//         const units = this.calculateUnits(serviceType, amount);
//         const token = this.generateToken(); // Generate a unique token

//         const recharge = this.rechargeRepository.create({
//             serviceType,
//             meterNo,
//             amount,
//             units,
//             token,
//         });

//         const savedRecharge = await this.rechargeRepository.save(recharge);

//         return {
//             meterNo: savedRecharge.meterNo,
//             amount: savedRecharge.amount,
//             units,
//             token: savedRecharge.token,
//             rechargeDate: savedRecharge.rechargeDate,
//             serviceType,
//         };
//     }

//     /**
//      * Fetches recharge history for a specific service type
//      */
//     async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
//         return this.rechargeRepository.find({
//             where: { serviceType },
//             order: { rechargeDate: 'DESC' },
//         });
//     }
// }
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { RechargeEntity } from 'src/Entities/recharge.entity';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

interface PaymentResponse {
    success: boolean;
    checkout_url?: string;
    message?: string;
    data?: {
      checkout_url?: string;
    };
  }

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(RechargeEntity)
        private readonly rechargeRepository: Repository<RechargeEntity>,
    ) {}

    calculateUnits(serviceType: 'escom' | 'waterboard', amount: number): number {
        const rates = { escom: 1 / 200, waterboard: 1 / 100 };
        return amount * (rates[serviceType] || 0);
    }

    generateToken(): number {
        return Math.floor(100000000000000 + Math.random() * 900000000000000); // 15-digit number
    }

    // private async initiatePayment(amount: number, tx_ref: string): Promise<string> {
    //     try {
    //         const response = await axios.post<{ payment_url: string }>(
    //             'https://api.paychangu.com/initiate-payment',
    //             {
    //                 amount,
    //                 tx_ref,
    //                 currency: 'MWK',
    //                 redirect_url: 'https://your-app.com/payment-success', // Customize as needed
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );

    //         return response.data.payment_url; // Return payment link if needed
    //     } catch (error) {
    //         console.error('Error initiating payment:', error.response?.data || error.message);
    //         throw new HttpException(
    //             'Payment initiation failed',
    //             HttpStatus.BAD_REQUEST
    //         );
    //     }
    // }
    async initiatePayment(amount: number, transactionRef: string): Promise<PaymentResponse> {
        try {
            // Construct payment data
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK', // Malawian Kwacha
                callback_url: 'https://your-website.com/payment-callback', // Add your callback URL
            };
      
            // Send request to PayChangu API
            const response = await axios.post<PaymentResponse>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is loaded correctly
                        'Content-Type': 'application/json', // Explicit content type
                    },
                }
            );
      
            // Log the entire response for debugging purposes
            console.log('Payment API Response:', response.data);
      
            // Access checkout_url from the nested structure
            const checkoutUrl = response.data?.data?.checkout_url;
      
            // Check if the checkout_url exists
            if (checkoutUrl) {
                return { success: true, checkout_url: checkoutUrl };
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

    async processEscomRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'escom');
    }

    async processWaterboardRecharge(dto: rechargeDTO) {
        return this.processRecharge(dto, 'waterboard');
    }

    async processRecharge(dto: rechargeDTO, serviceType: 'escom' | 'waterboard') {
        const { meterNo, amount, tx_ref } = dto;

        // Initiate Payment (Optional: You can choose to wait for confirmation)
        const paymentUrl = await this.initiatePayment(amount, tx_ref);

        const units = this.calculateUnits(serviceType, amount);
        const token = this.generateToken();

        const recharge = this.rechargeRepository.create({
            serviceType,
            meterNo,
            amount,
            units,
            token,
        });

        const savedRecharge = await this.rechargeRepository.save(recharge);

        return {
            meterNo: savedRecharge.meterNo,
            amount: savedRecharge.amount,
            units,
            token: savedRecharge.token,
            rechargeDate: savedRecharge.rechargeDate,
            serviceType,
            paymentUrl, // Include payment URL in the response
        };
    }

    async getRechargeHistory(serviceType: 'escom' | 'waterboard'): Promise<RechargeEntity[]> {
        return this.rechargeRepository.find({
            where: { serviceType },
            order: { rechargeDate: 'DESC' },
        });
    }
}
