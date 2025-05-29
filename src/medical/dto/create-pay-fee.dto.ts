import { ApiProperty } from "@nestjs/swagger";

export class CreateHospitalFeePaymentDto {
   @ApiProperty()
    medicalId: string;
    @ApiProperty()
    amount: number;
    // Optionally, add more fields if needed (e.g., installment description, etc.)
  }
  