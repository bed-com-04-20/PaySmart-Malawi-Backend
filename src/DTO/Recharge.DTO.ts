import { ApiProperty } from "@nestjs/swagger"

//recharge DTO for handling user input

export class rechargeDTO{

    @ApiProperty()
    serviceType: 'escom' | 'waterboard'

    // @ApiProperty()
    // firebaseUid: string

    // @ApiProperty()
    // accountIdentifier?: string
    
    @ApiProperty()
    meterNo: number

    @ApiProperty()
    amount: number


}