import { Test, TestingModule } from '@nestjs/testing';
import { HouseManagementController } from './house_management.controller';

describe('HouseManagementController', () => {
  let controller: HouseManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HouseManagementController],
    }).compile();

    controller = module.get<HouseManagementController>(HouseManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
