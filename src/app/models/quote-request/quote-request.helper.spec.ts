import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { QuoteRequestHelper } from './quote-request.helper';
import { QuoteRequestData } from './quote-request.interface';

describe('Quote Request Helper', () => {
  describe('getQuoteRequestState', () => {
    let quoteRequestData: QuoteRequestData;

    beforeEach(() => {
      quoteRequestData = {
        type: 'QuoteRequest',
        displayName: 'DNAME',
        id: 'ID',
        number: 'NUM',
        creationDate: 1,
        total: {} as Price,
        items: [] as Link[],
        editable: false,
        submitted: false,
      };
    });

    it('should return New if submitted !== true', () => {
      quoteRequestData.submitted = false;

      expect(QuoteRequestHelper.getQuoteRequestState(quoteRequestData)).toEqual('New');
    });

    it('should return Submitted if submitted === true', () => {
      quoteRequestData.submitted = true;

      expect(QuoteRequestHelper.getQuoteRequestState(quoteRequestData)).toEqual('Submitted');
    });
  });
});
