import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UserAction, UserActionTypes } from 'ish-core/store/user';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

import { QuoteAction, QuoteRequestActionTypes } from './quote-request.actions';

export const quoteRequestAdapter = createEntityAdapter<QuoteRequestData>();

export interface QuoteRequestState extends EntityState<QuoteRequestData> {
  quoteRequestItems: QuoteRequestItem[];
  loading: boolean;
  error: HttpError;
  selected: string;
}

export const initialState: QuoteRequestState = quoteRequestAdapter.getInitialState({
  quoteRequestItems: [],
  loading: false,
  error: undefined,
  selected: undefined,
});

export function quoteRequestReducer(state = initialState, action: QuoteAction | UserAction): QuoteRequestState {
  switch (action.type) {
    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case QuoteRequestActionTypes.SelectQuoteRequest: {
      return {
        ...state,
        selected: action.payload.id,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequests:
    case QuoteRequestActionTypes.AddQuoteRequest:
    case QuoteRequestActionTypes.UpdateQuoteRequest:
    case QuoteRequestActionTypes.DeleteQuoteRequest:
    case QuoteRequestActionTypes.SubmitQuoteRequest:
    case QuoteRequestActionTypes.UpdateSubmitQuoteRequest:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequest:
    case QuoteRequestActionTypes.LoadQuoteRequestItems:
    case QuoteRequestActionTypes.AddProductToQuoteRequest:
    case QuoteRequestActionTypes.AddBasketToQuoteRequest:
    case QuoteRequestActionTypes.UpdateQuoteRequestItems:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequest: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestsFail:
    case QuoteRequestActionTypes.AddQuoteRequestFail:
    case QuoteRequestActionTypes.UpdateQuoteRequestFail:
    case QuoteRequestActionTypes.DeleteQuoteRequestFail:
    case QuoteRequestActionTypes.SubmitQuoteRequestFail:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestFail:
    case QuoteRequestActionTypes.LoadQuoteRequestItemsFail:
    case QuoteRequestActionTypes.AddProductToQuoteRequestFail:
    case QuoteRequestActionTypes.AddBasketToQuoteRequestFail:
    case QuoteRequestActionTypes.UpdateQuoteRequestItemsFail:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequestFail: {
      const error = action.payload.error;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestsSuccess: {
      const quoteRequests = action.payload.quoteRequests;

      if (!state) {
        return;
      }

      return {
        ...quoteRequestAdapter.setAll(quoteRequests, state),
        loading: false,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess: {
      const quoteRequestItems = action.payload.quoteRequestItems;

      return {
        ...state,
        quoteRequestItems,
        loading: false,
      };
    }

    case QuoteRequestActionTypes.AddQuoteRequestSuccess:
    case QuoteRequestActionTypes.UpdateQuoteRequestSuccess:
    case QuoteRequestActionTypes.DeleteQuoteRequestSuccess:
    case QuoteRequestActionTypes.SubmitQuoteRequestSuccess:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess:
    case QuoteRequestActionTypes.AddProductToQuoteRequestSuccess:
    case QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess:
    case QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess: {
      return {
        ...state,
        loading: false,
        error: undefined,
      };
    }
  }

  return state;
}
