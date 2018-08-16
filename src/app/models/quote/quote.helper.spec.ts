import { Price } from '../price/price.model';
import { QuoteRequestItem } from '../quote-request-item/quote-request-item.model';

import { QuoteHelper } from './quote.helper';
import { QuoteData } from './quote.interface';

describe('Quote Helper', () => {
  describe('getQuoteState', () => {
    let quoteData: QuoteData;

    beforeEach(() => {
      quoteData = {
        type: 'Quote',
        displayName: 'DNAME',
        id: 'ID',
        number: 'NUM',
        creationDate: 1,
        total: {} as Price,
        items: [] as QuoteRequestItem[],
      };
    });

    it('should return Responded on default', () => {
      expect(QuoteHelper.getQuoteState(quoteData)).toEqual('Responded');
    });

    it('should return Rejected if rejected === true', () => {
      quoteData.rejected = true;

      expect(QuoteHelper.getQuoteState(quoteData)).toEqual('Rejected');
    });

    // TODO: converted state?
  });
});
