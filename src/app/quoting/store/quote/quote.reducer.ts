import { HttpErrorResponse } from '@angular/common/http';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteAction, QuoteActionTypes } from './';

export interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: HttpErrorResponse;
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
    case QuoteActionTypes.CreateQuoteRequestFromQuote: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteActionTypes.LoadQuotesFail:
    case QuoteActionTypes.DeleteQuoteFail:
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
    case QuoteActionTypes.CreateQuoteRequestFromQuoteSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
