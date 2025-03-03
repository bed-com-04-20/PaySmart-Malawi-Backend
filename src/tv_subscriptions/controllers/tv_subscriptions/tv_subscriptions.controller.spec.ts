import { Test, TestingModule } from '@nestjs/testing';
import { TvSubscriptionsController } from './tv_subscriptions.controller';

describe('TvSubscriptionsController', () => {
  let controller: TvSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TvSubscriptionsController],
    }).compile();

    controller = module.get<TvSubscriptionsController>(TvSubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
