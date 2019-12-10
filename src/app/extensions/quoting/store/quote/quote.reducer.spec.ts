import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../models/quote/quote.interface';

import * as fromActions from './quote.actions';
import { initialState, quoteReducer } from './quote.reducer';

describe('Quote Reducer', () => {
  describe('LoadQuotes actions', () => {
    describe('SelectQuote', () => {
      it('should select a quote when reduced', () => {
        const action = new fromActions.SelectQuote({ id: 'test' });
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
        const action = new fromActions.LoadQuotesFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuotesSuccess action', () => {
      it('should set quotes and set loading to false', () => {
        const quotes = {
          quotes: [
            {
              id: 'test',
            } as QuoteData,
          ],
        };

        const action = new fromActions.LoadQuotesSuccess(quotes);
        const state = quoteReducer(initialState, action);

        expect(state.ids).toEqual(['test']);
        expect(state.entities).toEqual({ test: quotes.quotes[0] });
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('DeleteQuote actions', () => {
    describe('DeleteQuote action', () => {
      it('should set loading to true', () => {
        const id = 'test';
        const action = new fromActions.DeleteQuote({ id });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.DeleteQuoteSuccess({ id });
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
        const action = new fromActions.RejectQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('RejectQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.RejectQuoteSuccess({ id });
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
        const action = new fromActions.CreateQuoteRequestFromQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const quoteLineItemRequest = {} as QuoteLineItemResult;
        const action = new fromActions.CreateQuoteRequestFromQuoteSuccess({ quoteLineItemRequest });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('AddQuoteToBasket actions', () => {
    describe('AddQuoteToBasket action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddQuoteToBasket({ quoteId: 'QID' });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddQuoteToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.AddQuoteToBasketFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const link = {} as Link;
        const action = new fromActions.AddQuoteToBasketSuccess({ link });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });
});
