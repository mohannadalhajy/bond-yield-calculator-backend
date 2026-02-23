import { calculateYTM } from './ytm';
import { CouponFrequencyEnum } from './cashflow';

describe('YTM Calculator', () => {
  it('should calculate YTM for premium bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 5;
    const marketPrice = 1100; // Premium
    const yearsToMaturity = 10;
    const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
    
    const result = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );
    
    // YTM should be less than coupon rate for premium bond
    expect(result).toBeLessThan(5);
    expect(result).toBeGreaterThan(0);
  });

  it('should calculate YTM for discount bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 5;
    const marketPrice = 900; // Discount
    const yearsToMaturity = 10;
    const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
    
    const result = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );
    
    // YTM should be greater than coupon rate for discount bond
    expect(result).toBeGreaterThan(5);
  });

  it('should calculate YTM for par bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 6;
    const marketPrice = 1000; // Par
    const yearsToMaturity = 5;
    const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
    
    const result = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );
    
    // YTM should equal coupon rate for par bond
    expect(result).toBeCloseTo(6, 2);
  });

  it('should calculate YTM for zero coupon bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 0;
    const marketPrice = 800;
    const yearsToMaturity = 5;
    const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
    
    const result = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );
    
    // YTM should be positive for zero coupon bond
    expect(result).toBeGreaterThan(0);
  });

  it('should handle semi-annual compounding', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 6;
    const marketPrice = 950;
    const yearsToMaturity = 5;
    const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.SEMI_ANNUAL;
    
    const result = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );
    
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });
});
