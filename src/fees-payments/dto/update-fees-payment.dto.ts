import { PartialType } from '@nestjs/swagger';
import { CreateFeesPaymentDto } from './create-fees-payment.dto';

export class UpdateFeesPaymentDto extends PartialType(CreateFeesPaymentDto) {}
