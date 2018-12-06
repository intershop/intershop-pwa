import { BasketRebate } from '../basket-rebate/basket-rebate.model';

import { OrderData } from './order.interface';
import { OrderMapper } from './order.mapper';

describe('Order Mapper', () => {
  describe('fromData', () => {
    it(`should return Order when getting OrderData`, () => {
      const orderData = {
        documentNo: '4711',
        shippingBuckets: [
          {
            lineItems: [
              {
                name: 'test',
                product: {
                  title: 'testSKU',
                },
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
      } as OrderData;
      const order = OrderMapper.fromData(orderData);

      expect(order).toBeTruthy();
      expect(order.documentNo).toEqual(orderData.documentNo);
      expect(order.lineItems[0].productSKU).toBe(orderData.shippingBuckets[0].lineItems[0].product.title);
      expect(order.commonShippingMethod).toBe(orderData.shippingBuckets[0].shippingMethod);
      expect(order.commonShipToAddress).toBe(orderData.shippingBuckets[0].shipToAddress);
      expect(order.totals.itemTotal.value).toBe(orderData.totals.itemTotal.value);
      expect(order.totals.valueRebates[0].rebateType).toBe(orderData.valueRebates[0].rebateType);
      expect(order.totals.itemSurchargeTotalsByType[0].amount.value).toBe(
        orderData.itemSurchargeTotalsByType[0].amount.value
      );
    });
  });
});
