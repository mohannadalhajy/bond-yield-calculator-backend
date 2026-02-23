/**
 * Calculate current yield of a bond
 * Current Yield = (Annual Coupon Payment) / (Market Price)
 */
export function calculateCurrentYield(
  faceValue: number,
  annualCouponRatePercent: number,
  marketPrice: number
): number {
  const annualCouponPayment = (faceValue * annualCouponRatePercent) / 100;
  return (annualCouponPayment / marketPrice) * 100;
}
