import { ApiProperty } from "@nestjs/swagger";

export class CreateHousePaymentDto {
    @ApiProperty()
        houseId: number
    
        @ApiProperty({})
        amount: number;
}
