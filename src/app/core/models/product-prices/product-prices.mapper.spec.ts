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
                minQuantity: { value: 5 },
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
            "maxListPrice": undefined,
            "maxSalePrice": undefined,
            "minListPrice": undefined,
            "minSalePrice": undefined,
            "salePrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
            "scaledPrices": Array [
              Object {
                "currency": "USD",
                "gross": 1.5,
                "minQuantity": 5,
                "net": 0.5,
                "type": "PriceItem",
              },
            ],
            "summedUpListPrice": undefined,
            "summedUpSalePrice": undefined,
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
            "maxListPrice": undefined,
            "maxSalePrice": undefined,
            "minListPrice": undefined,
            "minSalePrice": undefined,
            "salePrice": Object {
              "currency": "USD",
              "gross": 2,
              "net": 1,
              "type": "PriceItem",
            },
            "scaledPrices": Array [
              Object {
                "currency": "USD",
                "gross": 1,
                "minQuantity": 2,
                "net": 0.5,
                "type": "PriceItem",
              },
            ],
            "summedUpListPrice": undefined,
            "summedUpSalePrice": undefined,
          },
          "sku": "abc",
        }
      `);
    });
    it('should set no ScaledPrice when all SalePrice items have no minQuantity > 1', () => {
      expect(
        ProductPricesMapper.fromData({
          sku: 'abc',
          prices: {
            SalePrice: [
              {
                gross: { value: 1, currency: 'USD' },
                net: { value: 0.5, currency: 'USD' },
                minQuantity: { value: 1 },
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
        }).prices.scaledPrices
      ).toHaveLength(0);
    });
  });
});
