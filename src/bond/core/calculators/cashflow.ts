import { ApiProperty } from "@nestjs/swagger";

export enum CashFlowItemTypeEnum {
  COUPON = 'COUPON',
  PRINCIPAL = 'PRINCIPAL'
}

export class CashFlowItem {
  @ApiProperty({ type: Date, example: '2025-01-01' })
  paymentDate: string;
  @ApiProperty({ type: Number, example: 50 })
  amount: number;
  @ApiProperty({ enum: CashFlowItemTypeEnum, example: CashFlowItemTypeEnum.COUPON })
  type: CashFlowItemTypeEnum;
}

export enum CouponFrequencyEnum {
  ANNUAL = 'ANNUAL',
  SEMI_ANNUAL = 'SEMI_ANNUAL'
}

/**
 * Simple helper to add months to a date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Generate cash flow schedule for a bond
 */
export function generateCashFlowSchedule(
  faceValue: number,
  annualCouponRatePercent: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyEnum,
  startDate?: string
): CashFlowItem[] {
  const cashFlows: CashFlowItem[] = [];
  const couponPayment = (faceValue * annualCouponRatePercent) / 100;
  const paymentsPerYear = couponFrequency === CouponFrequencyEnum.SEMI_ANNUAL ? 2 : 1;
  const couponPaymentPerPeriod = couponPayment / paymentsPerYear;
  const totalPayments = yearsToMaturity * paymentsPerYear;
  
  const start = startDate ? new Date(startDate) : new Date();
  
  for (let i = 1; i <= totalPayments; i++) {
    const paymentDate = addMonths(start, (12 / paymentsPerYear) * i);
    
    // Add coupon payment only if it's greater than 0
    if (couponPaymentPerPeriod > 0) {
      cashFlows.push({
        paymentDate: paymentDate.toISOString().split('T')[0],
        amount: couponPaymentPerPeriod,
        type: CashFlowItemTypeEnum.COUPON
      });
    }
    
    // Add principal payment at maturity
    if (i === totalPayments) {
      cashFlows.push({
        paymentDate: paymentDate.toISOString().split('T')[0],
        amount: faceValue,
        type: CashFlowItemTypeEnum.PRINCIPAL
      });
    }
  }
  
  return cashFlows;
}

/**
 * Generate row-based cash flow schedule for API response
 */
export function generateCashFlowRows(
  faceValue: number,
  annualCouponRatePercent: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyEnum,
  startDate?: string
): Array<{
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}> {
  const rows = [];
  const periodsPerYear = couponFrequency === CouponFrequencyEnum.ANNUAL ? 1 : 2;
  const totalPeriods = yearsToMaturity * periodsPerYear;
  const couponPayment = faceValue * (annualCouponRatePercent / 100) / periodsPerYear;
  
  const start = startDate ? new Date(startDate) : new Date();
  
  for (let i = 1; i <= totalPeriods; i++) {
    const paymentDate = addMonths(start, (12 / periodsPerYear) * i);
    const cumulativeInterest = couponPayment * i;
    const remainingPrincipal = i < totalPeriods ? faceValue : 0;
    
    rows.push({
      period: i,
      paymentDate: paymentDate.toISOString().split('T')[0],
      couponPayment,
      cumulativeInterest,
      remainingPrincipal
    });
  }
  
  return rows;
}

/**
 * Calculate total interest over bond lifetime
 */
export function calculateTotalInterest(
  faceValue: number,
  annualCouponRatePercent: number,
  yearsToMaturity: number
): number {
  const annualCouponPayment = (faceValue * annualCouponRatePercent) / 100;
  return annualCouponPayment * yearsToMaturity;
}
