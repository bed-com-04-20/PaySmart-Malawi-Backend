import { Test, TestingModule } from '@nestjs/testing';
import { TvSubscriptionsService } from './tv_subscriptions.service';

describe('TvSubscriptionsService', () => {
  let service: TvSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TvSubscriptionsService],
    }).compile();

    service = module.get<TvSubscriptionsService>(TvSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
