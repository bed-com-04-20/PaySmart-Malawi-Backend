import { Injectable } from '@nestjs/common';
import { CreateHousePaymentDto } from './dto/create-house-payment.dto';
import { UpdateHousePaymentDto } from './dto/update-house-payment.dto';

@Injectable()
export class HousePaymentsService {
  create(createHousePaymentDto: CreateHousePaymentDto) {
    return 'This action adds a new housePayment';
  }

  findAll() {
    return `This action returns all housePayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} housePayment`;
  }

  update(id: number, updateHousePaymentDto: UpdateHousePaymentDto) {
    return `This action updates a #${id} housePayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} housePayment`;
  }
}
