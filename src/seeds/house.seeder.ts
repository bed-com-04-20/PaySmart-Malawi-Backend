import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousePayment } from 'src/house-payments/entities/house-payment.entity';

@Injectable()
export class HouseSeeder {
  constructor(
    @InjectRepository(HousePayment)
    private readonly housePaymentRepository: Repository<HousePayment>,
  ) {}

  async seedHouses(): Promise<void> {
    const houses = [
        // Ndola (10 houses)
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

        // Chiwembe (10 houses)
        { deltaNumber: 11, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 12, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 13, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 14, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 15, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 16, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 17, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 18, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 19, location: 'Chiwembe', price: 50000 },
        { deltaNumber: 20, location: 'Chiwembe', price: 50000 },

        // Chinyonga (10 houses)
        { deltaNumber: 21, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 22, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 23, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 24, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 25, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 26, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 27, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 28, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 29, location: 'Chinyonga', price: 60000 },
        { deltaNumber: 30, location: 'Chinyonga', price: 60000 },

        // Naperi (10 houses)
        { deltaNumber: 31, location: 'Naperi', price: 50000 },
        { deltaNumber: 32, location: 'Naperi', price: 50000 },
        { deltaNumber: 33, location: 'Naperi', price: 50000 },
        { deltaNumber: 34, location: 'Naperi', price: 50000 },
        { deltaNumber: 35, location: 'Naperi', price: 50000 },
        { deltaNumber: 36, location: 'Naperi', price: 50000 },
        { deltaNumber: 37, location: 'Naperi', price: 50000 },
        { deltaNumber: 38, location: 'Naperi', price: 50000 },
        { deltaNumber: 39, location: 'Naperi', price: 50000 },
        { deltaNumber: 40, location: 'Naperi', price: 50000 },

        // Area 25 (10 houses)
        { deltaNumber: 41, location: 'Area 25', price: 45000 },
        { deltaNumber: 42, location: 'Area 25', price: 45000 },
        { deltaNumber: 43, location: 'Area 25', price: 45000 },
        { deltaNumber: 44, location: 'Area 25', price: 45000 },
        { deltaNumber: 45, location: 'Area 25', price: 45000 },
        { deltaNumber: 46, location: 'Area 25', price: 45000 },
        { deltaNumber: 47, location: 'Area 25', price: 45000 },
        { deltaNumber: 48, location: 'Area 25', price: 45000 },
        { deltaNumber: 49, location: 'Area 25', price: 45000 },
        { deltaNumber: 50, location: 'Area 25', price: 45000 },

        // Nkolokosa (10 houses)
        { deltaNumber: 51, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 52, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 53, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 54, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 55, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 56, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 57, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 58, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 59, location: 'Nkolokosa', price: 60000 },
        { deltaNumber: 60, location: 'Nkolokosa', price: 60000 },

        // Soche East (10 houses)
        { deltaNumber: 61, location: 'Soche East', price: 55000 },
        { deltaNumber: 62, location: 'Soche East', price: 55000 },
        { deltaNumber: 63, location: 'Soche East', price: 55000 },
        { deltaNumber: 64, location: 'Soche East', price: 55000 },
        { deltaNumber: 65, location: 'Soche East', price: 55000 },
        { deltaNumber: 66, location: 'Soche East', price: 55000 },
        { deltaNumber: 67, location: 'Soche East', price: 55000 },
        { deltaNumber: 68, location: 'Soche East', price: 55000 },
        { deltaNumber: 69, location: 'Soche East', price: 55000 },
        { deltaNumber: 70, location: 'Soche East', price: 55000 },

        // Chitawira (10 houses)
        { deltaNumber: 71, location: 'Chitawira', price: 65000 },
        { deltaNumber: 72, location: 'Chitawira', price: 65000 },
        { deltaNumber: 73, location: 'Chitawira', price: 65000 },
        { deltaNumber: 74, location: 'Chitawira', price: 65000 },
        { deltaNumber: 75, location: 'Chitawira', price: 65000 },
        { deltaNumber: 76, location: 'Chitawira', price: 65000 },
        { deltaNumber: 77, location: 'Chitawira', price: 65000 },
        { deltaNumber: 78, location: 'Chitawira', price: 65000 },
        { deltaNumber: 79, location: 'Chitawira', price: 65000 },
        { deltaNumber: 80, location: 'Chitawira', price: 65000 },
    ];

    const houseEntities = houses.map((house) =>
      this.housePaymentRepository.create({
        ...house,
        paidAmount: 0,
        isFullyPaid: false,
        remainingBalance: house.price, // Set initial remaining balance to the price
      }),
    );

    // Insert or update based on `deltaNumber`
    
    await this.housePaymentRepository.upsert(houseEntities, ['deltaNumber']);

    console.log('✅ All houses seeded successfully!');
  }
}
