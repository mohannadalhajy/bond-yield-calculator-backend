import { calculateCurrentYield } from './current-yield';

describe('Current Yield Calculator', () => {
  it('should calculate current yield correctly for premium bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 5;
    const marketPrice = 1100;
    
    const result = calculateCurrentYield(faceValue, annualCouponRatePercent, marketPrice);
    
    // Current Yield = (1000 * 0.05) / 1100 * 100 = 4.545%
    expect(result).toBeCloseTo(4.545, 3);
  });

  it('should calculate current yield correctly for discount bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 5;
    const marketPrice = 900;
    
    const result = calculateCurrentYield(faceValue, annualCouponRatePercent, marketPrice);
    
    // Current Yield = (1000 * 0.05) / 900 * 100 = 5.556%
    expect(result).toBeCloseTo(5.556, 3);
  });

  it('should calculate current yield correctly for par bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 6;
    const marketPrice = 1000;
    
    const result = calculateCurrentYield(faceValue, annualCouponRatePercent, marketPrice);
    
    // Current Yield = (1000 * 0.06) / 1000 * 100 = 6%
    expect(result).toBeCloseTo(6.0, 3);
  });

  it('should handle zero coupon bond', () => {
    const faceValue = 1000;
    const annualCouponRatePercent = 0;
    const marketPrice = 800;
    
    const result = calculateCurrentYield(faceValue, annualCouponRatePercent, marketPrice);
    
    expect(result).toBe(0);
  });
});
