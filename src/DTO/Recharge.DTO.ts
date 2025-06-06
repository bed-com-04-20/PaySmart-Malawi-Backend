import { ApiProperty } from "@nestjs/swagger"

//recharge DTO for handling user input

export class rechargeDTO{

    // @ApiProperty()
    // serviceType: 'escom' | 'waterboard'

    // @ApiProperty()
    // firebaseUid: string

    // @ApiProperty()
    // accountIdentifier?: string
    
    @ApiProperty({maxLength:10})
    meterNo: number

    @ApiProperty()
    amount: number

   


}

export class RechargeHistoryDto{
    @ApiProperty({ example: 976645657, description: 'Meter number to fetch history' })
    meterNo: number;
}