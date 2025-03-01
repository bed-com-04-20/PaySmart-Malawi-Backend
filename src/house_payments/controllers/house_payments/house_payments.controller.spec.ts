import { Test, TestingModule } from '@nestjs/testing';
import { HousePaymentsController } from './house_payments.controller';

describe('HousePaymentsController', () => {
  let controller: HousePaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousePaymentsController],
    }).compile();

    controller = module.get<HousePaymentsController>(HousePaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
