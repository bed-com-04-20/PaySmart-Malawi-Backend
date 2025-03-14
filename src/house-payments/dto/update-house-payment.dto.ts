import { PartialType } from '@nestjs/swagger';
import { CreateHousePaymentDto } from './create-house-payment.dto';

export class UpdateHousePaymentDto extends PartialType(CreateHousePaymentDto) {}
