import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDTO{
    @ApiProperty()
    packageId: string

    @ApiProperty()
    accountNumber: string;
    
}