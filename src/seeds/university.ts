// src/seed/universities.seeder.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniversityEntity } from 'src/Entities/university';
import { Repository } from 'typeorm';


@Injectable()
export class UniversitiesSeeder {
  private readonly logger = new Logger(UniversitiesSeeder.name);

  constructor(
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
  ) {}

  async seedUniversities(): Promise<void> {
    // Define the list of universities.
    const universities = [
      { name: 'unima' },
      { name: 'mubas' },
      { name: 'kuhes' },
      { name: 'luanar' },
      { name: 'mzuni' },
    ];

    for (const uniData of universities) {
      // Use upsert to insert or update records based on the unique "name" field.
      // If duplicate names are allowed (as in the case of "kuhes"), consider adding a secondary unique property,
      // for example, a unique university code.
      await this.universityRepository.upsert(uniData, ['name']);
    }

    this.logger.log('✅ Universities seeded successfully!');
  }
}
