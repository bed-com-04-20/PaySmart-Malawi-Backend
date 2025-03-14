import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HousePaymentsService } from './house-payments.service';
import { CreateHousePaymentDto } from './dto/create-house-payment.dto';
import { UpdateHousePaymentDto } from './dto/update-house-payment.dto';

@Controller('house-payments')
export class HousePaymentsController {
  constructor(private readonly housePaymentsService: HousePaymentsService) {}

  @Post()
  create(@Body() createHousePaymentDto: CreateHousePaymentDto) {
    return this.housePaymentsService.create(createHousePaymentDto);
  }

  @Get()
  findAll() {
    return this.housePaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housePaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHousePaymentDto: UpdateHousePaymentDto) {
    return this.housePaymentsService.update(+id, updateHousePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.housePaymentsService.remove(+id);
  }
}
