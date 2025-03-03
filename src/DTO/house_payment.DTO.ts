import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, IsNotEmpty } from 'class-validator';

export class PaymentDTO {
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @ApiProperty()
    houseId: number;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @ApiProperty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    payerName: string; // Name of the person paying

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    tx_ref: string; // PayChangu transaction reference
}
