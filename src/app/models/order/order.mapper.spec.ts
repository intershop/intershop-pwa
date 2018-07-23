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
      } as OrderData;
      const order = OrderMapper.fromData(orderData);

      expect(order).toBeTruthy();
      expect(order.documentNo).toEqual(orderData.documentNo);
      expect(order.lineItems[0].productSKU).toBe(orderData.shippingBuckets[0].lineItems[0].product.title);
      expect(order.commonShippingMethod).toBe(orderData.shippingBuckets[0].shippingMethod);
      expect(order.commonShipToAddress).toBe(orderData.shippingBuckets[0].shipToAddress);
    });
  });
});
