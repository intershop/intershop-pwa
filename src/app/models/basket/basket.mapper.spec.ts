import { BasketRebate } from '../basket-rebate/basket-rebate.model';

import { BasketData } from './basket.interface';
import { BasketMapper } from './basket.mapper';
import { Basket } from './basket.model';

describe('Basket Mapper', () => {
  describe('fromData', () => {
    let basket: Basket;
    let basketData: BasketData;
    beforeEach(() => {
      basketData = {
        invoiceToAddress: { urn: '123' },
        shippingBuckets: [
          {
            lineItems: [
              {
                name: 'test',
              },
            ],
            name: 'test',
            shippingMethod: {
              id: 'test',
            },
            shipToAddress: {
              urn: 'test',
            },
          },
        ],
        totals: {
          itemTotal: {
            value: 141796.98,
            currencyMnemonic: 'USD',
          },
        },
        valueRebates: [
          {
            name: 'appliedRebate',
            amount: {
              value: 11.9,
              currencyMnemonic: 'USD',
            },
            rebateType: 'OrderValueOffDiscount',
          } as BasketRebate,
        ],
        itemSurchargeTotalsByType: [
          {
            name: 'surcharge',
            amount: {
              value: 595,
              currencyMnemonic: 'USD',
            },
            description: 'Surcharge for battery deposit',
            displayName: 'Battery Deposit Surcharge',
          },
        ],
      } as BasketData;
    });

    it(`should return Basket when getting BasketData`, () => {
      basket = BasketMapper.fromData(basketData);
      expect(basket).toBeTruthy();
      expect(basket.lineItems).toBe(basketData.shippingBuckets[0].lineItems);
      expect(basket.commonShippingMethod).toBe(basketData.shippingBuckets[0].shippingMethod);
      expect(basket.commonShipToAddress).toBe(basketData.shippingBuckets[0].shipToAddress);
      expect(basket.totals.itemTotal.value).toBe(basketData.totals.itemTotal.value);
      expect(basket.totals.valueRebates[0].rebateType).toBe(basketData.valueRebates[0].rebateType);
      expect(basket.totals.itemSurchargeTotalsByType[0].amount.value).toBe(
        basketData.itemSurchargeTotalsByType[0].amount.value
      );
    });

    it('should return false if invoice and shipping address and shipping method are available', () => {
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeFalse();
    });

    it('should return true if invoiceToAddress is missing', () => {
      basketData.invoiceToAddress = undefined;
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should return true if commonShipToAddress is missing', () => {
      basketData.shippingBuckets[0].shipToAddress = undefined;
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeTrue();
    });

    it('should return true if shippingMethod is missing', () => {
      basketData.shippingBuckets[0].shippingMethod = undefined;
      basket = BasketMapper.fromData(basketData);
      expect(basket.totals.isEstimated).toBeTrue();
    });
  });
});
