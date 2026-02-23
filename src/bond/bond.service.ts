import { Injectable } from '@nestjs/common';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondResultDto, PremiumOrDiscountEnum } from './dto/bond-result.dto';
import {
  calculateCurrentYield,
  calculateYTM,
  generateCashFlowRows,
  calculateTotalInterest,
  CouponFrequencyEnum,
} from './core/calculators';

@Injectable()
export class BondService {
  calculateBondMetrics(calculateBondDto: CalculateBondDto): BondResultDto {
    const {
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
      startDate,
    } = calculateBondDto;

    // Calculate current yield
    const currentYieldPercent = calculateCurrentYield(
      faceValue,
      annualCouponRatePercent,
      marketPrice
    );

    // Calculate YTM
    const ytmPercent = calculateYTM(
      faceValue,
      annualCouponRatePercent,
      marketPrice,
      yearsToMaturity,
      couponFrequency
    );

    // Calculate total interest
    const totalInterest = calculateTotalInterest(
      faceValue,
      annualCouponRatePercent,
      yearsToMaturity
    );

    // Determine premium or discount status
    let premiumOrDiscount: PremiumOrDiscountEnum;
    const priceDifference = Math.abs(marketPrice - faceValue);
    const tolerance = faceValue * 0.001; // 0.1% tolerance for "at par"

    if (priceDifference <= tolerance) {
      premiumOrDiscount = PremiumOrDiscountEnum.AT_PAR;
    } else if (marketPrice > faceValue) {
      premiumOrDiscount = PremiumOrDiscountEnum.PREMIUM;
    } else {
      premiumOrDiscount = PremiumOrDiscountEnum.DISCOUNT;
    }

    // Generate cash flow schedule
    const cashFlows = generateCashFlowRows(
      faceValue,
      annualCouponRatePercent,
      yearsToMaturity,
      couponFrequency,
      startDate
    );

    return {
      currentYieldPercent,
      ytmPercent,
      totalInterest,
      premiumOrDiscount,
      cashFlows,
    };
  }
}
