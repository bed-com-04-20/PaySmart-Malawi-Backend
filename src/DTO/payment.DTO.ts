import { ApiProperty } from '@nestjs/swagger';

export class PaymentsDto {
  @ApiProperty({
    description: 'The payment amount',
    example: '5000',
  })
  amount?: string;

  @ApiProperty({
    description: 'The currency of the payment',
    example: 'MWK',
  })
  currency: string;

  @ApiProperty({
    description: 'The email of the payer',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The transaction reference ID',
    example: 'tx12345',
  })
  tx_ref: string;

  @ApiProperty({
    description: 'The phone number of the payer (optional)',
    example: '+265987654321',
    required: false,
  })
  phone_number?: string;

  @ApiProperty({
    description: 'The name of the payer (optional)',
    example: 'John Doe',
    required: false,
  })
  name?: string;
}

export class InitiatePayoutDto {
  @ApiProperty({
    description: 'The phone number to receive the payout',
    example: '+265987654321',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The amount to be paid out',
    example: '1000',
  })
  amount: string;
}
