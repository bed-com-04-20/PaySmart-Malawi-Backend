// src/seeds/tv_seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVServiceEntity } from 'src/Entities/TVservice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TVSeederService {
  constructor(
    @InjectRepository(TVServiceEntity)
    private readonly serviceRepository: Repository<TVServiceEntity>,

    @InjectRepository(TvPackageEntity)
    private readonly packageRepository: Repository<TvPackageEntity>,
  ) {}

  async seed() {
    const tvServices = [
      { name: 'AzamTV' },
      { name: 'GOtv' },
      { name: 'StarSat' },
      { name: 'StarTimes' },
    ];

    // Insert TV services
    for (const serviceData of tvServices) {
      let service = await this.serviceRepository.findOne({ where: { name: serviceData.name } });
      if (!service) {
        service = this.serviceRepository.create(serviceData);
        await this.serviceRepository.save(service);
      }

      // Insert packages for each service
      const packages = [
        { name: `${service.name} Basic`, price: 2500 },
        { name: `${service.name} Silver`, price: 10000 },
        { name: `${service.name} Gold`, price: 25000 },
        { name: `${service.name} Platinum`, price: 50000 },
      ];

      for (const pkg of packages) {
        const existingPackage = await this.packageRepository.findOne({
          where: { name: pkg.name },
        });

        if (!existingPackage) {
          const newPackage = this.packageRepository.create({ ...pkg, service });
          await this.packageRepository.save(newPackage);
        }
      }
    }

    console.log('✅ TV Services and Packages Seeded Successfully!');
  }
}
