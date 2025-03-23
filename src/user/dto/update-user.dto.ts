import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: "The user's phone number", required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Waterboard meter number', required: false })
  @IsOptional()
  @IsString()
  meterNo?: number;

  @ApiProperty({ description: 'House payment Delta Number', required: false })
  @IsOptional()
  @IsString()
  deltaNumber?: number;

  @ApiProperty({ description: 'House payment Delta Number', required: false })
  @IsOptional()
  @IsString()
  WaterBoardNo?: number;
  
  @ApiProperty({ description: 'House payment Delta Number', required: false })
  @IsOptional()
  @IsString()
  decoderNo?: number;
  
}
