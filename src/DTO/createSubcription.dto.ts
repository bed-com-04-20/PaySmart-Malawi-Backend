import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDTO{
    @ApiProperty()
    packageId: number

    @ApiProperty()
    accountNumber: number;
    
}