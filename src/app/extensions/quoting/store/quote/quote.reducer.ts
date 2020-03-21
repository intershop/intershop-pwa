import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuoteData } from '../../models/quote/quote.interface';

import { QuoteAction, QuoteActionTypes } from './quote.actions';

export const quoteAdapter = createEntityAdapter<QuoteData>();

export interface QuoteState extends EntityState<QuoteData> {
  loading: boolean;
  error: HttpError;
  selected: string;
}

export const initialState: QuoteState = quoteAdapter.getInitialState({
  loading: false,
  error: undefined,
  selected: undefined,
});

export function quoteReducer(state = initialState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case QuoteActionTypes.SelectQuote: {
      return {
        ...state,
        selected: action.payload.id,
      };
    }

    case QuoteActionTypes.LoadQuotes:
    case QuoteActionTypes.DeleteQuote:
    case QuoteActionTypes.RejectQuote:
    case QuoteActionTypes.CreateQuoteRequestFromQuote:
    case QuoteActionTypes.AddQuoteToBasket: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteActionTypes.LoadQuotesFail:
    case QuoteActionTypes.DeleteQuoteFail:
    case QuoteActionTypes.RejectQuoteFail:
    case QuoteActionTypes.CreateQuoteRequestFromQuoteFail:
    case QuoteActionTypes.AddQuoteToBasketFail: {
      const error = action.payload.error;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case QuoteActionTypes.LoadQuotesSuccess: {
      const quotes = action.payload.quotes;
      if (!state) {
        return;
      }

      return {
        ...quoteAdapter.setAll(quotes, state),
        loading: false,
      };
    }

    case QuoteActionTypes.DeleteQuoteSuccess:
    case QuoteActionTypes.RejectQuoteSuccess:
    case QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess:
    case QuoteActionTypes.AddQuoteToBasketSuccess: {
      return {
        ...state,
        loading: false,
      };
    }

    case QuoteActionTypes.ResetQuoteError: {
      return {
        ...state,
        error: undefined,
      };
    }
  }

  return state;
}
