import { IsNumber, IsPositive, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponFrequencyEnum } from '../core/calculators/cashflow';

export class CalculateBondDto {
  @ApiProperty({ example: 1000, description: 'Face value of the bond' })
  @IsNumber()
  @IsPositive()
  faceValue: number;

  @ApiProperty({ example: 5, description: 'Annual coupon rate in percent' })
  @IsNumber()
  @Min(0)
  annualCouponRatePercent: number;

  @ApiProperty({ example: 950, description: 'Current market price of the bond' })
  @IsNumber()
  @IsPositive()
  marketPrice: number;

  @ApiProperty({ example: 10, description: 'Years until bond maturity' })
  @IsNumber()
  @IsPositive()
  yearsToMaturity: number;

  @ApiProperty({ 
    enum: CouponFrequencyEnum, 
    example: CouponFrequencyEnum.ANNUAL,
    description: 'Frequency of coupon payments' 
  })
  @IsString()
  @IsIn(Object.values(CouponFrequencyEnum))
  couponFrequency: CouponFrequencyEnum;

  @ApiPropertyOptional({ 
    example: '2024-01-01',
    description: 'Start date for cash flow calculations (ISO string)' 
  })
  @IsOptional()
  @IsString()
  startDate?: string;
}
