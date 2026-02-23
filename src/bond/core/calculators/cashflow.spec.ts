import { generateCashFlowRows, calculateTotalInterest, CouponFrequencyEnum } from './cashflow';

describe('Cash Flow Calculator', () => {
  describe('generateCashFlowRows', () => {
    it('should generate annual cash flow schedule correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 5;
      const yearsToMaturity = 3;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
      
      const result = generateCashFlowRows(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(3); // 3 periods for annual payments
      
      // Check first period
      expect(result[0]).toEqual({
        period: 1,
        paymentDate: expect.any(String),
        couponPayment: 50, // 1000 * 0.05 / 1
        cumulativeInterest: 50,
        remainingPrincipal: 1000
      });
      
      // Check last period (principal is paid off)
      expect(result[2].period).toBe(3);
      expect(result[2].couponPayment).toBe(50);
      expect(result[2].cumulativeInterest).toBe(150); // 50 * 3
      expect(result[2].remainingPrincipal).toBe(0);
    });

    it('should generate semi-annual cash flow schedule correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 6;
      const yearsToMaturity = 2;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.SEMI_ANNUAL;
      
      const result = generateCashFlowRows(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(4); // 2 years * 2 periods per year
      
      // Check coupon amounts (annual coupon / 2)
      result.forEach(cf => {
        expect(cf.couponPayment).toBe(30); // (1000 * 0.06) / 2
      });
      
      // Check first and last periods
      expect(result[0].period).toBe(1);
      expect(result[0].cumulativeInterest).toBe(30);
      expect(result[0].remainingPrincipal).toBe(1000);
      
      expect(result[3].period).toBe(4);
      expect(result[3].cumulativeInterest).toBe(120); // 30 * 4
      expect(result[3].remainingPrincipal).toBe(0);
    });

    it('should handle zero coupon bond', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 0;
      const yearsToMaturity = 5;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
      
      const result = generateCashFlowRows(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(5); // 5 periods for 5 years
      
      // All periods should have zero coupon payments
      result.forEach(cf => {
        expect(cf.couponPayment).toBe(0);
        expect(cf.cumulativeInterest).toBe(0);
      });
      
      // Check last period
      expect(result[4].period).toBe(5);
      expect(result[4].remainingPrincipal).toBe(0);
    });

    it('should accept custom start date', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 5;
      const yearsToMaturity = 1;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
      const startDate = '2024-01-01';
      
      const result = generateCashFlowRows(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency,
        startDate
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].paymentDate).toBe('2025-01-01'); // 1 year later
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 5;
      const yearsToMaturity = 10;
      
      const result = calculateTotalInterest(faceValue, annualCouponRatePercent, yearsToMaturity);
      
      expect(result).toBe(500); // 1000 * 0.05 * 10
    });

    it('should return zero for zero coupon bond', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 0;
      const yearsToMaturity = 10;
      
      const result = calculateTotalInterest(faceValue, annualCouponRatePercent, yearsToMaturity);
      
      expect(result).toBe(0);
    });

    it('should handle fractional years correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 6;
      const yearsToMaturity = 2.5;
      
      const result = calculateTotalInterest(faceValue, annualCouponRatePercent, yearsToMaturity);
      
      expect(result).toBe(150); // 1000 * 0.06 * 2.5
    });
  });
});
