import { BasketRebate } from '../basket-rebate/basket-rebate.model';
import { BasketData } from './basket.interface';
import { BasketMapper } from './basket.mapper';

describe('Basket Mapper', () => {
  describe('fromData', () => {
    it(`should return Basket when getting BasketData`, () => {
      const basketData = {
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
      const basket = BasketMapper.fromData(basketData);

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
  });
});
