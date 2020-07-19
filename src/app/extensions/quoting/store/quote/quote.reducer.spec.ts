import { Link } from 'ish-core/models/link/link.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../models/quote/quote.interface';

import {
  addQuoteToBasket,
  addQuoteToBasketFail,
  addQuoteToBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteFail,
  createQuoteRequestFromQuoteSuccess,
  deleteQuote,
  deleteQuoteFail,
  deleteQuoteSuccess,
  loadQuotes,
  loadQuotesFail,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteFail,
  rejectQuoteSuccess,
  selectQuote,
} from './quote.actions';
import { initialState, quoteReducer } from './quote.reducer';

describe('Quote Reducer', () => {
  describe('LoadQuotes actions', () => {
    describe('SelectQuote', () => {
      it('should select a quote when reduced', () => {
        const action = selectQuote({ id: 'test' });
        const state = quoteReducer(initialState, action);

        expect(state.selected).toEqual('test');
      });
    });

    describe('LoadQuotes action', () => {
      it('should set loading to true', () => {
        const action = loadQuotes();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuotesFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadQuotesFail({ error });
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

        const action = loadQuotesSuccess(quotes);
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
        const action = deleteQuote({ id });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = deleteQuoteSuccess({ id });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('RejectQuote actions', () => {
    describe('RejectQuote action', () => {
      it('should set loading to true', () => {
        const action = rejectQuote();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('RejectQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = rejectQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('RejectQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = rejectQuoteSuccess({ id });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateQuoteRequestFromQuote actions', () => {
    describe('CreateQuoteRequestFromQuote action', () => {
      it('should set loading to true', () => {
        const action = createQuoteRequestFromQuote();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateQuoteRequestFromQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = createQuoteRequestFromQuoteFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const quoteLineItemRequest = {} as QuoteLineItemResult;
        const action = createQuoteRequestFromQuoteSuccess({ quoteLineItemRequest });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('AddQuoteToBasket actions', () => {
    describe('AddQuoteToBasket action', () => {
      it('should set loading to true', () => {
        const action = addQuoteToBasket({ quoteId: 'QID' });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddQuoteToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = addQuoteToBasketFail({ error });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const link = {} as Link;
        const action = addQuoteToBasketSuccess({ link });
        const state = quoteReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });
});
