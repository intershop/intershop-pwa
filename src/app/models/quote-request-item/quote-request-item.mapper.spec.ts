import { QuoteRequestItemMapper } from './quote-request-item.mapper';
import { QuoteRequestItem } from './quote-request-item.model';

describe('Quote Request Item Mapper', () => {
  describe('fromData', () => {
    it(`should return QuoteRequestItem when getting QuoteRequestItemData`, () => {
      const quoteRequestItemData = {
        type: 'QuoteRequestLineItem',
        quantity: {
          type: 'Quantity',
          value: 2,
          unit: '',
        },
        singlePrice: {
          type: 'Money',
          value: 237.5,
          currencyMnemonic: 'USD',
        },
        totalPrice: {
          type: 'Money',
          value: 475,
          currencyMnemonic: 'USD',
        },
        productSKU: '9438012',
      };
      const quoteRequestItem: QuoteRequestItem = QuoteRequestItemMapper.fromData(quoteRequestItemData, 'test');

      expect(quoteRequestItem).toBeTruthy();
      expect(quoteRequestItem.totals.total).toBe(quoteRequestItemData.totalPrice);
      expect(quoteRequestItem.singleBasePrice).toBe(quoteRequestItemData.singlePrice);
      expect(quoteRequestItem.id).toBe('test');
    });
  });
});
