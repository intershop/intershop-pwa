import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getLoggedInCustomer } from 'ish-core/store/user';

import { BasketRebateData } from './basket-rebate.interface';
import { BasketRebateMapper } from './basket-rebate.mapper';

describe('Basket Rebate Mapper', () => {
  let basketRebateMapper: BasketRebateMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: {} }] }), BasketRebateMapper],
    });

    basketRebateMapper = TestBed.get(BasketRebateMapper);
  });

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

      const basketRebate = basketRebateMapper.fromData(basketRebateData);

      expect(basketRebate).toBeTruthy();
      expect(basketRebate.id).toBe(basketRebateData.id);
      expect(basketRebate.rebateType).toBe(basketRebateData.promotionType);
      expect(basketRebate.description).toBe(basketRebateData.description);
      expect(basketRebate.code).toBe(basketRebateData.code);
      expect(basketRebate.amount.value).toBePositive();
      expect(basketRebate.promotionId).toBe(basketRebateData.promotion);
    });
  });
});
