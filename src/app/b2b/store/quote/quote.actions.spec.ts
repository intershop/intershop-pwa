import { HttpErrorResponse } from '@angular/common/http';
import { Quote } from '../../../models/quote/quote.model';
import * as fromActions from './quote.actions';

describe('Quote Actions', () => {
  describe('Load Quote Actions', () => {
    it('should create new action for LoadQuotes', () => {
      const action = new fromActions.LoadQuotes();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotes,
      });
    });

    it('should create new action for LoadQuotesFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadQuotesFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotesFail,
        payload,
      });
    });

    it('should create new action for LoadQuotesSuccess', () => {
      const payload = [{ id: '123' } as Quote];
      const action = new fromActions.LoadQuotesSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotesSuccess,
        payload,
      });
    });
  });

  describe('Delete Quote Actions', () => {
    it('should create new action for DeleteQuote', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuote(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuote,
        payload,
      });
    });

    it('should create new action for DeleteQuoteFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.DeleteQuoteFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteFail,
        payload,
      });
    });

    it('should create new action for DeleteQuoteSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteSuccess,
        payload,
      });
    });
  });
});
