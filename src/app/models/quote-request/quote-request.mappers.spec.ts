import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { QuoteRequestData } from './quote-request.interface';
import { QuoteRequestMapper } from './quote-request.mapper';

describe('Quote Request Mappers', () => {
  describe('fromData', () => {
    it(`should return QuoteRequest when getting QuoteRequestData`, () => {
      const quoteRequestData = {
        type: 'QuoteRequest',
        displayName: 'DNAME',
        id: 'ID',
        number: 'NUM',
        creationDate: 1,
        total: {} as Price,
        items: [] as Link[],
        editable: false,
        submitted: false,
      } as QuoteRequestData;

      const quoteRequestItem = QuoteRequestMapper.fromData(quoteRequestData);

      expect(quoteRequestItem).toBeTruthy();
      expect(!!quoteRequestItem).toBeTruthy();
    });
  });
});
