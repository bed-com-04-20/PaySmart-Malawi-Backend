import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeesPaymentsService } from './fees-payments.service';
import { CreateFeesPaymentDto } from './dto/create-fees-payment.dto';
import { UpdateFeesPaymentDto } from './dto/update-fees-payment.dto';

@Controller('fees-payments')
export class FeesPaymentsController {
  constructor(private readonly feesPaymentsService: FeesPaymentsService) {}

  @Post()
  create(@Body() createFeesPaymentDto: CreateFeesPaymentDto) {
    return this.feesPaymentsService.create(createFeesPaymentDto);
  }

  @Get()
  findAll() {
    return this.feesPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feesPaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeesPaymentDto: UpdateFeesPaymentDto) {
    return this.feesPaymentsService.update(+id, updateFeesPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feesPaymentsService.remove(+id);
  }
}
