import { IsNumber, IsString, Min, IsNotEmpty } from 'class-validator';

export class PaymentDTO {
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    houseId: number;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    payerName: string; // Name of the person paying

    @IsString()
    @IsNotEmpty()
    tx_ref: string; // PayChangu transaction reference
}
