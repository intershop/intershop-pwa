import { HttpErrorResponse } from '@angular/common/http';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { QuoteAction, QuoteActionTypes } from './';

export interface QuoteState {
  quotes: Quote[];
  quoteRequests: QuoteRequest[];
  quoteRequestItems: QuoteRequestItem[];
  loading: boolean;
  error: HttpErrorResponse;
  selected: string;
}

export const initialState: QuoteState = {
  quotes: [],
  quoteRequests: [],
  quoteRequestItems: [],
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

    case QuoteActionTypes.LoadQuoteRequests:
    case QuoteActionTypes.LoadQuotes:
    case QuoteActionTypes.AddQuoteRequest:
    case QuoteActionTypes.UpdateQuoteRequest:
    case QuoteActionTypes.DeleteQuoteRequest:
    case QuoteActionTypes.DeleteQuote:
    case QuoteActionTypes.LoadQuoteRequestItems:
    case QuoteActionTypes.AddProductToQuoteRequest:
    case QuoteActionTypes.UpdateQuoteRequestItems:
    case QuoteActionTypes.DeleteItemFromQuoteRequest: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteActionTypes.LoadQuoteRequestsFail:
    case QuoteActionTypes.LoadQuotesFail:
    case QuoteActionTypes.AddQuoteRequestFail:
    case QuoteActionTypes.UpdateQuoteRequestFail:
    case QuoteActionTypes.DeleteQuoteRequestFail:
    case QuoteActionTypes.DeleteQuoteFail:
    case QuoteActionTypes.LoadQuoteRequestItemsFail:
    case QuoteActionTypes.AddProductToQuoteRequestFail:
    case QuoteActionTypes.UpdateQuoteRequestItemsFail:
    case QuoteActionTypes.DeleteItemFromQuoteRequestFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case QuoteActionTypes.LoadQuoteRequestsSuccess: {
      const quoteRequests = action.payload;

      return {
        ...state,
        quoteRequests: quoteRequests,
        loading: false,
      };
    }

    case QuoteActionTypes.LoadQuoteRequestItemsSuccess: {
      const quoteRequestItems = action.payload;

      return {
        ...state,
        quoteRequestItems,
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

    case QuoteActionTypes.AddQuoteRequestSuccess:
    case QuoteActionTypes.UpdateQuoteRequestSuccess:
    case QuoteActionTypes.DeleteQuoteRequestSuccess:
    case QuoteActionTypes.DeleteQuoteSuccess:
    case QuoteActionTypes.AddProductToQuoteRequestSuccess:
    case QuoteActionTypes.UpdateQuoteRequestItemsSuccess:
    case QuoteActionTypes.DeleteItemFromQuoteRequestSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
