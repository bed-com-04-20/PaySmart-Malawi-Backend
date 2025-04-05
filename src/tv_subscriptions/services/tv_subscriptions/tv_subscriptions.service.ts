import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVsubscription } from 'src/Entities/TVsubscription.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class TvSubscriptionsService {
    constructor(
        @InjectRepository(TVsubscription)
        private readonly tvSubscriptionRepository: Repository<TVsubscription>,

        @InjectRepository(TvPackageEntity)
        private readonly tvPackageRepository: Repository<TvPackageEntity>
    ) {}

    async listPackages(): Promise<TvPackageEntity[]> {
        return this.tvPackageRepository.find();
    }

    async processSubscription(dto: CreateSubscriptionDTO) {
        const { packageId, accountNumber } = dto;

        const packageData = await this.tvPackageRepository.findOne({ where: { id: packageId } });
        if (!packageData) {
            throw new HttpException('Package not found', HttpStatus.NOT_FOUND);
        }

        const transactionRef = `TX-${Date.now()}`;

        const paymentResponse = await this.initiatePayment(packageData.price, transactionRef);
        if (!paymentResponse.success) {
            return { message: 'Invalid payment' };
        }

        const subscription = this.tvSubscriptionRepository.create({
            accountNumber,
            packages: [packageData],
            tx_ref: transactionRef,
            status: 'success',
        });
        await this.tvSubscriptionRepository.save(subscription);

        return {
            message: 'Subscription successful',
            transactionRef,
            package: packageData.name,
            accountNumber,
            price: packageData.price,
            checkout_url: paymentResponse.checkout_url, // Optional: return checkout URL if needed
        };
    }

    async initiatePayment(amount: number, transactionRef: string): Promise<any> {
        try {
            // Construct payment data
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
                callback_url: 'https://your-website.com/payment-callback', // Add your callback URL here
            };

            // Define the expected response structure
            interface PaymentResponse {
                message: string;
                status: string;
                data: {
                    event: string;
                    checkout_url: string;
                    data: {
                        tx_ref: string;
                        currency: string;
                        amount: number;
                        mode: string;
                        status: string;
                    };
                };
            }

            // Send request to PayChangu API
            const response = await axios.post<PaymentResponse>(
                'https://api.paychangu.com/payment',
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`, // Ensure your API key is loaded correctly
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Check the nested data for the checkout URL
            if (response.data && response.data.data && response.data.data.checkout_url) {
                return { success: true, checkout_url: response.data.data.checkout_url };
            } else {
                console.error('Invalid response format:', response.data);
                return { success: false, message: 'Invalid response from payment API' };
            }
        } catch (error) {
            console.error('Payment error:', error.response?.data || error.message);
            return { success: false, message: error.response?.data || error.message };
        }
    }
}
