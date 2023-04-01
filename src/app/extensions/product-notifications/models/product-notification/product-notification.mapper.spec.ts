import { ProductNotificationData } from './product-notification.interface';
import { ProductNotificationMapper } from './product-notification.mapper';

describe('Product Notification Mapper', () => {
  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => ProductNotificationMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming data for price notification to model data', () => {
      const productNotificationData: ProductNotificationData = {
        sku: '12345',
        notificationMailAddress: 'test@test.intershop.de',
        price: { type: 'Money', value: 75, currency: 'USD' },
      };

      const mapped = ProductNotificationMapper.fromData(productNotificationData, 'price');
      expect(mapped).toMatchInlineSnapshot(`
        {
          "id": "12345_price",
          "notificationMailAddress": "test@test.intershop.de",
          "price": {
            "currency": "USD",
            "type": "Money",
            "value": 75,
          },
          "sku": "12345",
          "type": "price",
        }
      `);
    });

    it('should map incoming data for stock notification to model data', () => {
      const productNotificationData: ProductNotificationData = {
        sku: '12345',
        notificationMailAddress: 'test@test.intershop.de',
      };

      const mapped = ProductNotificationMapper.fromData(productNotificationData, 'stock');
      expect(mapped).toMatchInlineSnapshot(`
        {
          "id": "12345_stock",
          "notificationMailAddress": "test@test.intershop.de",
          "price": undefined,
          "sku": "12345",
          "type": "stock",
        }
      `);
    });
  });
});
