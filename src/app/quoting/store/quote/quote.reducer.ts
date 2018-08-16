import { HttpError } from '../../../models/http-error/http-error.model';
import { QuoteData } from '../../../models/quote/quote.interface';

import { QuoteAction, QuoteActionTypes } from './quote.actions';

export interface QuoteState {
  quotes: QuoteData[];
  loading: boolean;
  error: HttpError;
  selected: string;
}

export const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: undefined,
  selected: undefined,
};

export function quoteReducer(state = initialState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case QuoteActionTypes.SelectQuote: {
      return {
        ...state,
        selected: action.payload,
      };
    }

    case QuoteActionTypes.LoadQuotes:
    case QuoteActionTypes.DeleteQuote:
    case QuoteActionTypes.RejectQuote:
    case QuoteActionTypes.CreateQuoteRequestFromQuote: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteActionTypes.LoadQuotesFail:
    case QuoteActionTypes.DeleteQuoteFail:
    case QuoteActionTypes.RejectQuoteFail:
    case QuoteActionTypes.CreateQuoteRequestFromQuoteFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case QuoteActionTypes.LoadQuotesSuccess: {
      const quotes = action.payload;

      return {
        ...state,
        quotes: quotes,
        loading: false,
      };
    }

    case QuoteActionTypes.DeleteQuoteSuccess:
    case QuoteActionTypes.RejectQuoteSuccess:
    case QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
