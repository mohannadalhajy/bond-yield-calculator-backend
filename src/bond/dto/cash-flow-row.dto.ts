import { ApiProperty } from '@nestjs/swagger';

export class CashFlowRowDto {
  @ApiProperty({ type: Number, example: 1, description: 'Period number (1..N)' })
  period: number;

  @ApiProperty({ type: String, example: '2025-01-01', description: 'Payment date in ISO format' })
  paymentDate: string;

  @ApiProperty({ type: Number, example: 50, description: 'Coupon payment for this period' })
  couponPayment: number;

  @ApiProperty({ type: Number, example: 100, description: 'Running sum of coupon payments' })
  cumulativeInterest: number;

  @ApiProperty({ type: Number, example: 1000, description: 'Remaining principal (0 in final period)' })
  remainingPrincipal: number;
}
