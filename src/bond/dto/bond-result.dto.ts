import { ApiProperty } from '@nestjs/swagger';
import { CashFlowRowDto } from './cash-flow-row.dto';

export enum PremiumOrDiscountEnum {
  PREMIUM = 'PREMIUM',
  DISCOUNT = 'DISCOUNT',
  AT_PAR = 'AT_PAR'
}

export class BondResultDto {
  @ApiProperty({ type: Number, example: 5.26, description: 'Current yield as percentage' })
  currentYieldPercent: number;

  @ApiProperty({ type: Number, example: 5.67, description: 'Yield to maturity as percentage' })
  ytmPercent: number;

  @ApiProperty({ type: Number, example: 500, description: 'Total interest over bond lifetime' })
  totalInterest: number;

  @ApiProperty({ 
    enum: PremiumOrDiscountEnum, 
    example: PremiumOrDiscountEnum.DISCOUNT,
    description: 'Bond price status relative to face value' 
  })
  premiumOrDiscount: PremiumOrDiscountEnum;

  @ApiProperty({ 
    type: CashFlowRowDto,
    isArray: true,
    description: 'Cash flow schedule with period-based rows' 
  })
  cashFlows: CashFlowRowDto[];
}
