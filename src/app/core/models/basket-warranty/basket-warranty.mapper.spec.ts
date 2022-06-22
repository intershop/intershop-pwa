import { BasketWarrantyMapper } from './basket-warranty.mapper';

describe('Basket Warranty Mapper', () => {
  describe('fromData', () => {
    it(`should return BasketWarranty when getting BasketWarrantyData`, () => {
      const basketWarranty = BasketWarrantyMapper.fromData({
        product: '1YLEDTVSUP ',
        price: {
          gross: {
            value: 43.34,
            currency: 'USD',
          },
          net: {
            value: 40.34,
            currency: 'USD',
          },
        },
      });

      expect(basketWarranty).toMatchInlineSnapshot(`
        Object {
          "price": Object {
            "currency": "USD",
            "gross": 43.34,
            "net": 40.34,
            "type": "PriceItem",
          },
          "sku": "1YLEDTVSUP ",
        }
      `);
    });
  });
});
