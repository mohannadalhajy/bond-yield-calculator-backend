import { generateCashFlowSchedule, calculateTotalInterest, CouponFrequencyEnum, CashFlowItemTypeEnum } from './cashflow';

describe('Cash Flow Calculator', () => {
  describe('generateCashFlowSchedule', () => {
    it('should generate annual cash flow schedule correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 5;
      const yearsToMaturity = 3;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
      
      const result = generateCashFlowSchedule(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(4); // 3 coupons + 1 principal
      expect(result.filter(cf => cf.type === CashFlowItemTypeEnum.COUPON)).toHaveLength(3);
      expect(result.filter(cf => cf.type === CashFlowItemTypeEnum.PRINCIPAL)).toHaveLength(1);
      
      // Check coupon amounts
      result.filter(cf => cf.type === CashFlowItemTypeEnum.COUPON).forEach(cf => {
        expect(cf.amount).toBe(50); // 1000 * 0.05
      });
      
      // Check principal amount
      const principalPayment = result.find(cf => cf.type === CashFlowItemTypeEnum.PRINCIPAL);
      expect(principalPayment?.amount).toBe(1000);
    });

    it('should generate semi-annual cash flow schedule correctly', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 6;
      const yearsToMaturity = 2;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.SEMI_ANNUAL;
      
      const result = generateCashFlowSchedule(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(5); // 4 coupons + 1 principal
      expect(result.filter(cf => cf.type === CashFlowItemTypeEnum.COUPON)).toHaveLength(4);
      expect(result.filter(cf => cf.type === CashFlowItemTypeEnum.PRINCIPAL)).toHaveLength(1);
      
      // Check coupon amounts (annual coupon / 2)
      result.filter(cf => cf.type === CashFlowItemTypeEnum.COUPON).forEach(cf => {
        expect(cf.amount).toBe(30); // (1000 * 0.06) / 2
      });
    });

    it('should handle zero coupon bond', () => {
      const faceValue = 1000;
      const annualCouponRatePercent = 0;
      const yearsToMaturity = 5;
      const couponFrequency: CouponFrequencyEnum = CouponFrequencyEnum.ANNUAL;
      
      const result = generateCashFlowSchedule(
        faceValue,
        annualCouponRatePercent,
        yearsToMaturity,
        couponFrequency
      );
      
      expect(result).toHaveLength(1); // Only principal payment
      expect(result[0].type).toBe(CashFlowItemTypeEnum.PRINCIPAL);
      expect(result[0].amount).toBe(1000);
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
  });
});
