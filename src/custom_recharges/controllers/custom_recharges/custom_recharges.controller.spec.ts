import { Test, TestingModule } from '@nestjs/testing';
import { CustomRechargesController } from './custom_recharges.controller';

describe('CustomRechargesController', () => {
  let controller: CustomRechargesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomRechargesController],
    }).compile();

    controller = module.get<CustomRechargesController>(CustomRechargesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
