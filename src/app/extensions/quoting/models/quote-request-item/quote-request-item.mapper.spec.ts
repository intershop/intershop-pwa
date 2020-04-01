import { QuoteRequestItemMapper } from './quote-request-item.mapper';

describe('Quote Request Item Mapper', () => {
  describe('fromData', () => {
    it(`should return QuoteRequestItem when getting QuoteRequestItemData`, () => {
      const quoteRequestItem = QuoteRequestItemMapper.fromData(
        {
          type: 'QuoteRequestLineItem',
          quantity: {
            type: 'Quantity',
            value: 2,
            unit: '',
          },
          originQuantity: {
            type: 'Quantity',
            value: 2,
            unit: '',
          },
          singlePrice: {
            type: 'Money',
            value: 237.5,
            currency: 'USD',
          },
          originSinglePrice: {
            type: 'Money',
            value: 237.5,
            currency: 'USD',
          },
          totalPrice: {
            type: 'Money',
            value: 475,
            currency: 'USD',
          },
          originTotalPrice: {
            type: 'Money',
            value: 495,
            currency: 'USD',
          },
          productSKU: '9438012',
        },
        'test'
      );

      expect(quoteRequestItem).toMatchInlineSnapshot(`
        Object {
          "id": "test",
          "originQuantity": Object {
            "type": "Quantity",
            "unit": "",
            "value": 2,
          },
          "originSingleBasePrice": Object {
            "currency": "USD",
            "type": "Money",
            "value": 237.5,
          },
          "productSKU": "9438012",
          "quantity": Object {
            "type": "Quantity",
            "unit": "",
            "value": 2,
          },
          "singleBasePrice": Object {
            "currency": "USD",
            "type": "Money",
            "value": 237.5,
          },
          "totals": Object {
            "originTotal": Object {
              "currency": "USD",
              "type": "Money",
              "value": 495,
            },
            "total": Object {
              "currency": "USD",
              "type": "Money",
              "value": 475,
            },
          },
          "type": "QuoteRequestLineItem",
        }
      `);
    });
  });
});
