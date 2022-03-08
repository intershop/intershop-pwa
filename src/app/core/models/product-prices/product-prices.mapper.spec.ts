import { ProductPricesMapper } from './product-prices.mapper';

describe('Product Prices Mapper', () => {
  describe('fromData', () => {
    it('should map product price data to client object with prices for minQuantity=1', () => {
      expect(
        ProductPricesMapper.fromData({
          sku: 'abc',
          prices: {
            SalePrice: [
              {
                gross: { value: 2, currency: 'USD' },
                net: { value: 1, currency: 'USD' },
                minQuantity: { value: 1 },
                priceQuantity: { value: 1 },
              },

              {
                gross: { value: 1.5, currency: 'USD' },
                net: { value: 0.5, currency: 'USD' },
                minQuantity: { value: 2 },
                priceQuantity: { value: 1 },
              },
            ],

            ListPrice: [
              {
                gross: { value: 2, currency: 'USD' },
                net: { value: 1, currency: 'USD' },
                minQuantity: { value: 1 },
                priceQuantity: { value: 1 },
              },
            ],
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "prices": Object {
            "listPrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
            "salePrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
          },
          "sku": "abc",
        }
      `);
    });

    it('should set ListPrice as SalePrice when SalePrice doesnt contain price with minQuantity=1', () => {
      expect(
        ProductPricesMapper.fromData({
          sku: 'abc',
          prices: {
            SalePrice: [
              {
                gross: { value: 1, currency: 'USD' },
                net: { value: 0.5, currency: 'USD' },
                minQuantity: { value: 2 },
                priceQuantity: { value: 1 },
              },
            ],

            ListPrice: [
              {
                gross: { value: 2, currency: 'USD' },
                net: { value: 1, currency: 'USD' },
                minQuantity: { value: 1 },
                priceQuantity: { value: 1 },
              },
            ],
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "prices": Object {
            "listPrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
            "salePrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
          },
          "sku": "abc",
        }
      `);
    });
  });
});
