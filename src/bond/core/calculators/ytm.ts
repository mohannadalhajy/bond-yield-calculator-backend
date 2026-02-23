import { CouponFrequencyEnum } from './cashflow';

/**
 * Calculate Yield to Maturity using binary search method
 * YTM is the discount rate that equates the present value of cash flows to the market price
 */
export function calculateYTM(
  faceValue: number,
  annualCouponRatePercent: number,
  marketPrice: number,
  yearsToMaturity: number,
  couponFrequency: CouponFrequencyEnum
): number {
  const couponPayment = (faceValue * annualCouponRatePercent) / 100;
  const paymentsPerYear = couponFrequency === CouponFrequencyEnum.SEMI_ANNUAL ? 2 : 1;
  const couponPaymentPerPeriod = couponPayment / paymentsPerYear;
  const totalPayments = yearsToMaturity * paymentsPerYear;
  
  // Binary search parameters
  let lowerRate = 0;
  let upperRate = 1; // 100% annual rate as upper bound
  const tolerance = 1e-8;
  const maxIterations = 200;
  
  // Adjust upper bound if needed
  for (let i = 0; i < 10; i++) {
    const testRate = upperRate;
    const presentValue = calculatePresentValue(
      faceValue,
      couponPaymentPerPeriod,
      totalPayments,
      testRate / paymentsPerYear
    );
    
    if (presentValue > marketPrice) {
      upperRate *= 2;
    } else {
      break;
    }
  }
  
  // Binary search for YTM
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const midRate = (lowerRate + upperRate) / 2;
    const presentValue = calculatePresentValue(
      faceValue,
      couponPaymentPerPeriod,
      totalPayments,
      midRate / paymentsPerYear
    );
    
    if (Math.abs(presentValue - marketPrice) < tolerance) {
      return midRate * 100; // Convert to percentage
    }
    
    if (presentValue > marketPrice) {
      lowerRate = midRate;
    } else {
      upperRate = midRate;
    }
    
    if (upperRate - lowerRate < tolerance) {
      break;
    }
  }
  
  return ((lowerRate + upperRate) / 2) * 100; // Convert to percentage
}

/**
 * Calculate present value of all cash flows
 */
function calculatePresentValue(
  faceValue: number,
  couponPaymentPerPeriod: number,
  totalPayments: number,
  ratePerPeriod: number
): number {
  let presentValue = 0;
  
  // Present value of coupon payments
  for (let i = 1; i <= totalPayments; i++) {
    presentValue += couponPaymentPerPeriod / Math.pow(1 + ratePerPeriod, i);
  }
  
  // Present value of principal payment
  presentValue += faceValue / Math.pow(1 + ratePerPeriod, totalPayments);
  
  return presentValue;
}
