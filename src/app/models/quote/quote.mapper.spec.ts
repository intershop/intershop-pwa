import { Price } from '../price/price.model';
import { QuoteRequestItem } from '../quote-request-item/quote-request-item.model';
import { QuoteData } from './quote.interface';
import { QuoteMapper } from './quote.mapper';

describe('Quote Mapper', () => {
  describe('fromData', () => {
    it(`should return Quote when getting QuoteData`, () => {
      const quoteData = {
        type: 'Quote',
        displayName: 'DNAME',
        id: 'ID',
        number: 'NUM',
        creationDate: 1,
        total: {} as Price,
        items: [] as QuoteRequestItem[],
      } as QuoteData;

      const quoteItem = QuoteMapper.fromData(quoteData);

      expect(quoteItem).toBeTruthy();
      expect(!!quoteItem.state).toBeTruthy();
    });
  });
});
