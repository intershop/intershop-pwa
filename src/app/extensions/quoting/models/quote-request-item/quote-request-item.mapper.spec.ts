import { QuoteRequestItemData } from './quote-request-item.interface';
import { QuoteRequestItemMapper } from './quote-request-item.mapper';

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
      } as QuoteRequestItemData;
      const quoteRequestItem = QuoteRequestItemMapper.fromData(quoteRequestItemData, 'test');

      expect(quoteRequestItem).toBeTruthy();
      expect(quoteRequestItem.totals.total).toBe(quoteRequestItemData.totalPrice);
      expect(quoteRequestItem.totals.originTotal).toBe(quoteRequestItemData.originTotalPrice);
      expect(quoteRequestItem.singleBasePrice).toBe(quoteRequestItemData.singlePrice);
      expect(quoteRequestItem.originSingleBasePrice).toBe(quoteRequestItemData.originSinglePrice);
      expect(quoteRequestItem.id).toBe('test');
    });
  });
});
