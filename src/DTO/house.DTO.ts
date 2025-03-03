import { ApiProperty } from "@nestjs/swagger";

export class houseDTO{

    @ApiProperty()
    location: string;

    @ApiProperty()
    rentAmount: number;

    @ApiProperty()
    balance: number;
}