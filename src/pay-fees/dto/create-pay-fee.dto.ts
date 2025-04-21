import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentFeePaymentDto {
   @ApiProperty()
    registrationNumber: string;
    @ApiProperty()
    amount: number;
    // Optionally, add more fields if needed (e.g., installment description, etc.)
  }
  