import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { BasketBaseData, BasketData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { getLoggedInCustomer } from 'ish-core/store/user';

import { BasketTotalData } from './basket-total.interface';
import { BasketTotalMapper } from './basket-total.mapper';
import { BasketTotal } from './basket-total.model';

describe('Basket Total Mapper', () => {
  let basketTotalMapper: BasketTotalMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: {} }] }), BasketTotalMapper],
    });

    basketTotalMapper = TestBed.get(BasketTotalMapper);
  });

  const basketBaseData: BasketBaseData = {
    id: 'basket_1234',
    calculated: true,
    lineItems: ['YikKAE8BKC0AAAFrIW8IyLLD'],
    totals: {
      grandTotal: {
        gross: {
          value: 141796.98,
          currency: 'USD',
        },
        net: {
          value: 141796.98,
          currency: 'USD',
        },
        tax: {
          value: 543.65,
          currency: 'USD',
        },
      },
      itemTotal: {
        gross: {
          value: 141796.98,
          currency: 'USD',
        },
        net: {
          value: 141796.98,
          currency: 'USD',
        },
      },
    } as BasketTotalData,
    discounts: {
      valueBasedDiscounts: ['discount_1'],
    },
    surcharges: {
      itemSurcharges: [
        {
          name: 'item_surcharge',
          amount: {
            gross: {
              value: 654.56,
              currency: 'USD',
            },
            net: {
              value: 647.56,
              currency: 'USD',
            },
          },
          description: 'Surcharge for battery deposit',
        },
      ],
      bucketSurcharges: [
        {
          name: 'bucket_surcharge',
          amount: {
            gross: {
              value: 64.56,
              currency: 'USD',
            },
            net: {
              value: 61.86,
              currency: 'USD',
            },
          },
          description: 'Bucket Surcharge for hazardous material',
        },
      ],
    },
  };

  const basketIncludedData = {
    lineItems: {
      YikKAE8BKC0AAAFrIW8IyLLD: {
        id: '382478392',
        calculated: false,
        position: 1,
        freeGift: false,
        hiddenGift: false,
        quantity: { value: 4 },
        product: '8182790134363',
      } as LineItemData,
    },
    discounts: {
      discount_1: {
        id: 'discount_1',
        promotionType: 'OrderValueOffDiscount',
        amount: {
          gross: {
            currency: 'USD',
            value: 11.9,
          },
          net: {
            value: 10.56,
            currency: 'USD',
          },
        },
        code: 'INTERSHOP',
        description: 'For orders over 200 USD, a 10 USD Order discount is guaranteed for the Promo Code "INTERSHOP".',
        promotion: 'FreeShippingOnLEDTVs',
      },
    },
    discounts_promotion: {
      FreeShippingOnLEDTVs: {
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
      },
    },
  };

  describe('getTotals', () => {
    let totals: BasketTotal;
    let basketData: BasketData;
    beforeEach(() => {
      basketData = {
        data: { ...basketBaseData },
        included: { ...basketIncludedData },
      };
    });

    it(`should return totals when getting BasketData with totals`, () => {
      totals = basketTotalMapper.getTotals(basketBaseData);
      expect(totals).toBeTruthy();

      expect(totals.total.value).toBe(basketData.data.totals.grandTotal.gross.value);
      expect(totals.itemTotal.value).toBe(basketData.data.totals.itemTotal.gross.value);
      expect(totals.itemSurchargeTotalsByType[0].amount.value).toBe(
        basketData.data.surcharges.itemSurcharges[0].amount.gross.value
      );
      expect(totals.isEstimated).toBeFalse();
    });

    it(`should return totals when getting BasketData with discounts`, () => {
      totals = basketTotalMapper.getTotals(basketBaseData, basketIncludedData.discounts);
      expect(totals).toBeTruthy();

      expect(totals.valueRebates[0].amount.value).toBePositive();
      expect(totals.valueRebates[0].id).toEqual('discount_1');
    });
  });
});
