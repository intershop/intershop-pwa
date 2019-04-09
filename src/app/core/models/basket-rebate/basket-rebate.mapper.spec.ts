import { Promotion } from '../promotion/promotion.model';

import { BasketRebateData } from './basket-rebate.interface';
import { BasketRebateMapper } from './basket-rebate.mapper';

describe('Basket Rebate Mapper', () => {
  describe('fromData', () => {
    it(`should return BasketRebate when getting BasketRebateData`, () => {
      const basketRebateData = {
        id: 'basketDiscountId',
        promotionType: 'Discount',
        amount: {
          gross: {
            value: 43.34,
            currency: 'USD',
          },
          net: {
            value: 40.34,
            currency: 'USD',
          },
        },
        description: 'Dicount description',
        code: 'CODE5433',
        promotion: 'FreeShippingOnLEDTVs',
      } as BasketRebateData;
      const promotionData = {
        id: 'FreeShippingOnLEDTVs',
        couponCodeRequired: false,
        currency: 'USD',
        description: 'For LED TVs the shipping is free.',
        externalUrl: 'URL',
        icon: 'ICON',
        legalContentMessage: 'Legal Content Message',
        name: 'Free Shipping on LED TVs',
        promotionType: 'ShippingPercentageOffDiscount',
        ruleDescription: 'Buy any LED TV and the order ships free.',
        title: 'FREE SHIPPING',
        useExternalUrl: true,
        disableMessages: false,
      } as Promotion;

      const basketRebate = BasketRebateMapper.fromData(basketRebateData, promotionData);

      expect(basketRebate).toBeTruthy();
      expect(basketRebate.id).toBe(basketRebateData.id);
      expect(basketRebate.rebateType).toBe(basketRebateData.promotionType);
      expect(basketRebate.description).toBe(basketRebateData.description);
      expect(basketRebate.code).toBe(basketRebateData.code);
      expect(basketRebate.amount.value).toBePositive();
      expect(basketRebate.promotion).toBe(promotionData);
    });
  });
});
