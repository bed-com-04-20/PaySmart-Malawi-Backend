import { Test, TestingModule } from '@nestjs/testing';
import { CustomRechargesService } from './custom_recharges.service';

describe('CustomRechargesService', () => {
  let service: CustomRechargesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomRechargesService],
    }).compile();

    service = module.get<CustomRechargesService>(CustomRechargesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
