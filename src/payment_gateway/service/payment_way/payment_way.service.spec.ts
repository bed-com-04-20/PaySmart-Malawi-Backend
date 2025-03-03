import { Test, TestingModule } from '@nestjs/testing';
import { PaymentWayService } from './payment_way.service';

describe('PaymentWayService', () => {
  let service: PaymentWayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentWayService],
    }).compile();

    service = module.get<PaymentWayService>(PaymentWayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
