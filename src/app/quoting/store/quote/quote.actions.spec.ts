import { HttpErrorResponse } from '@angular/common/http';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../../models/quote/quote.interface';
import * as fromActions from './quote.actions';

describe('Quote Actions', () => {
  describe('SelectQuote Actions', () => {
    it('should create new action for SelectQuote', () => {
      const payload = 'test';
      const action = new fromActions.SelectQuote(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.SelectQuote,
        payload,
      });
    });
  });

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
      const payload = [{ id: '123' } as QuoteData];
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

  describe('Create Quote Request from Quote Actions', () => {
    it('should create new action for CreateQuoteRequestFromQuote', () => {
      const action = new fromActions.CreateQuoteRequestFromQuote();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.CreateQuoteRequestFromQuote,
      });
    });

    it('should create new action for CreateQuoteRequestFromQuoteFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.CreateQuoteRequestFromQuoteFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.CreateQuoteRequestFromQuoteFail,
        payload,
      });
    });

    it('should create new action for CreateQuoteRequestFromQuoteSuccess', () => {
      const payload = {} as QuoteLineItemResultModel;
      const action = new fromActions.CreateQuoteRequestFromQuoteSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess,
        payload,
      });
    });
  });
});
