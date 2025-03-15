import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HousePayment } from "src/house-payments/entities/house-payment.entity";

@Injectable()
export class HouseSeeder {
    constructor(
        @InjectRepository(HousePayment)
        private readonly housePaymentRepository: Repository<HousePayment>,
    ) {}

    async seedHouses() {
        const houses = [
            { deltaNumber: 1, location: 'Ndola', price: 40000 },
            { deltaNumber: 2, location: 'Ndola', price: 40000 },
            { deltaNumber: 3, location: 'Ndola', price: 40000 },
            { deltaNumber: 4, location: 'Ndola', price: 40000 },
            { deltaNumber: 5, location: 'Ndola', price: 40000 },
            { deltaNumber: 6, location: 'Ndola', price: 40000 },
            { deltaNumber: 7, location: 'Ndola', price: 40000 },
            { deltaNumber: 8, location: 'Ndola', price: 40000 },
            { deltaNumber: 9, location: 'Ndola', price: 40000 },
            { deltaNumber: 10, location: 'Ndola', price: 40000 },
        ];

        for (const house of houses) {
            // Dynamically calculate the remaining balance
            const houseData = {
                deltaNumber: house.deltaNumber,
                location: house.location,
                price: house.price,
                paidAmount: 0,
                // If using calculated remainingBalance, avoid passing it here
                isFullyPaid: false,
            };

            // Use `upsert` to insert or update based on `deltaNumber`
            await this.housePaymentRepository.upsert(
                houseData,
                ['deltaNumber'] // Ensure upsert happens based on `deltaNumber`
            );
        }

        console.log("✅ All houses seeded successfully!");
    }
}
