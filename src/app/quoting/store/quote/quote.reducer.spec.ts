import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { QuoteLineItemResultModel } from 'ish-core/models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from 'ish-core/models/quote/quote.interface';

import * as fromActions from './quote.actions';
import { initialState, quoteReducer } from './quote.reducer';

describe('Quote Reducer', () => {
  describe('LoadQuotes actions', () => {
    describe('SelectQuote', () => {
      it('should select a quote when reduced', () => {
        const action = new fromActions.SelectQuote('test');
        const state = quoteReducer(initialState, action);

        expect(state.selected).toEqual('test');
      });
    });

    describe('LoadQuotes action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadQuotes();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuotesFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.LoadQuotesFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuotesSuccess action', () => {
      it('should set quotes and set loading to false', () => {
        const quotes = [
          {
            id: 'test',
          } as QuoteData,
        ];

        const action = new fromActions.LoadQuotesSuccess(quotes);
        const state = quoteReducer(initialState, action);

        expect(state.quotes).toEqual(quotes);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('DeleteQuote actions', () => {
    describe('DeleteQuote action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuote(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteQuoteFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuoteSuccess(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('RejectQuote actions', () => {
    describe('RejectQuote action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.RejectQuote();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('RejectQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.RejectQuoteFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('RejectQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.RejectQuoteSuccess(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateQuoteRequestFromQuote actions', () => {
    describe('CreateQuoteRequestFromQuote action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.CreateQuoteRequestFromQuote();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateQuoteRequestFromQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.CreateQuoteRequestFromQuoteFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const payload = {} as QuoteLineItemResultModel;
        const action = new fromActions.CreateQuoteRequestFromQuoteSuccess(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });
});
