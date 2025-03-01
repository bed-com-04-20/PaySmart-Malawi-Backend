import { Test, TestingModule } from '@nestjs/testing';
import { HouseManagementService } from './house_management.service';

describe('HouseManagementService', () => {
  let service: HouseManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseManagementService],
    }).compile();

    service = module.get<HouseManagementService>(HouseManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
