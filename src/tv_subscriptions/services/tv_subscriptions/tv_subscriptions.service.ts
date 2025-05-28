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

    // List all available packages
    async listPackages(): Promise<TvPackageEntity[]> {
        return this.tvPackageRepository.find();
    }

    // Process the subscription
    async processSubscription(dto: CreateSubscriptionDTO) {
        const { packageId, accountNumber } = dto;

        // Ensure the account number is valid
        if (!accountNumber || isNaN(Number(accountNumber))) {
            throw new HttpException('Invalid account number', HttpStatus.BAD_REQUEST);
        }

        // Get the package data from the repository
        const packageData = await this.tvPackageRepository.findOne({ where: { id: packageId } });
        if (!packageData) {
            throw new HttpException('Package not found', HttpStatus.NOT_FOUND);
        }

        // Create a unique transaction reference
        const transactionRef = `TX-${Date.now()}`;

        // Initiate the payment request
        const paymentResponse = await this.initiatePayment(packageData.price, transactionRef);
        if (!paymentResponse.success) {
            throw new HttpException(paymentResponse.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Create and save the subscription
        const subscription = this.tvSubscriptionRepository.create({
            accountNumber,
            packages: [packageData],
            tx_ref: transactionRef,
            status: 'success',
        });
        await this.tvSubscriptionRepository.save(subscription);

        // Generate the transaction summary for this subscription
        const summary = this.generateTransactionSummary(subscription, packageData);

        return {
            message: 'Subscription successful',
            summary,
            checkout_url: paymentResponse.checkout_url, 
            tx_ref: transactionRef,  // <-- include this
        };
        
    }

    /**
     * Generates a transaction summary including the time, date,
     * TV package name, account number, and transaction reference.
     *
     * @param subscription The saved subscription entity
     * @param packageData The TV package entity selected by the user
     * @returns An object containing the transaction summary details
     */
    generateTransactionSummary(subscription: TVsubscription, packageData: TvPackageEntity) {
        const now = new Date();
        return {
            transactionDate: now.toLocaleDateString(),  // e.g. "MM/DD/YYYY" or region-specific format
            transactionTime: now.toLocaleTimeString(),    // e.g. "HH:MM:SS AM/PM"
            tvPackage: packageData.name,
            accountNumber: subscription.accountNumber,
            amount: packageData.price,
            tx_ref: subscription.tx_ref,
        };
    }

    /**
     * Retrieves transaction summaries for all subscriptions.
     *
     * @returns An array of transaction summary objects.
     */
    async getAllTransactionSummaries() {
        // Fetch all subscriptions along with their related packages
        const subscriptions = await this.tvSubscriptionRepository.find({
            relations: ['packages'],
        });

        if (!subscriptions || subscriptions.length === 0) {
            throw new HttpException('No transactions found', HttpStatus.NOT_FOUND);
        }

        // Map each subscription to its transaction summary.
        const summaries = subscriptions.map(subscription => {
            // Assuming each subscription has at least one package.
            const packageData = subscription.packages[0];
            return this.generateTransactionSummary(subscription, packageData);
        });

        return summaries;
    }

    async initiatePayment(amount: number, transactionRef: string): Promise<any> {
        try {
            // Define the payment data structure
            const paymentData = {
                tx_ref: transactionRef,
                amount,
                currency: 'MWK',
                callback_url: 'https://your-website.com/payment-callback', // Add your callback URL here
            };

            // Define the expected response type for payment
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

            // Check if the response contains a valid checkout URL
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
