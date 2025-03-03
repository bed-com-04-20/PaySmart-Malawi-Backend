import { Test, TestingModule } from '@nestjs/testing';
import { HousePaymentsService } from './house_payments.service';

describe('HousePaymentsService', () => {
  let service: HousePaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousePaymentsService],
    }).compile();

    service = module.get<HousePaymentsService>(HousePaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
