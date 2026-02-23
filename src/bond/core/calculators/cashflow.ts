import { ApiProperty } from "@nestjs/swagger";
import { CashFlowRowDto } from "src/bond/dto/cash-flow-row.dto";

export enum CashFlowItemTypeEnum {
  COUPON = 'COUPON',
  PRINCIPAL = 'PRINCIPAL'
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
 * Generate row-based cash flow schedule for API response
 */
export function generateCashFlowRows(
  faceValue: number,
  annualCouponRatePercent: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyEnum,
  startDate?: string
): CashFlowRowDto[] {
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
