import { Injectable } from '@nestjs/common';
import { CreateFeesPaymentDto } from './dto/create-fees-payment.dto';
import { UpdateFeesPaymentDto } from './dto/update-fees-payment.dto';

@Injectable()
export class FeesPaymentsService {
  create(createFeesPaymentDto: CreateFeesPaymentDto) {
    return 'This action adds a new feesPayment';
  }

  findAll() {
    return `This action returns all feesPayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feesPayment`;
  }

  update(id: number, updateFeesPaymentDto: UpdateFeesPaymentDto) {
    return `This action updates a #${id} feesPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} feesPayment`;
  }
}
