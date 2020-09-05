import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

import {
  addBasketToQuoteRequestFail,
  addBasketToQuoteRequestSuccess,
  addProductToQuoteRequest,
  addProductToQuoteRequestFail,
  addProductToQuoteRequestSuccess,
  addQuoteRequest,
  addQuoteRequestFail,
  addQuoteRequestSuccess,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestFail,
  createQuoteRequestFromQuoteRequestSuccess,
  deleteItemFromQuoteRequest,
  deleteItemFromQuoteRequestFail,
  deleteItemFromQuoteRequestSuccess,
  deleteQuoteRequest,
  deleteQuoteRequestFail,
  deleteQuoteRequestSuccess,
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
  submitQuoteRequest,
  submitQuoteRequestFail,
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestFail,
  updateQuoteRequestItems,
  updateQuoteRequestItemsFail,
  updateQuoteRequestItemsSuccess,
  updateQuoteRequestSuccess,
  updateSubmitQuoteRequest,
} from './quote-request.actions';

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

export const quoteRequestReducer = createReducer(
  initialState,
  on(selectQuoteRequest, (state: QuoteRequestState, action) => ({
    ...state,
    selected: action.payload.id,
  })),
  setLoadingOn(
    loadQuoteRequests,
    addQuoteRequest,
    updateQuoteRequest,
    deleteQuoteRequest,
    submitQuoteRequest,
    updateSubmitQuoteRequest,
    createQuoteRequestFromQuoteRequest,
    loadQuoteRequestItems,
    addProductToQuoteRequest,
    updateQuoteRequestItems,
    deleteItemFromQuoteRequest
  ),
  setErrorOn(
    loadQuoteRequestsFail,
    addQuoteRequestFail,
    updateQuoteRequestFail,
    deleteQuoteRequestFail,
    submitQuoteRequestFail,
    createQuoteRequestFromQuoteRequestFail,
    loadQuoteRequestItemsFail,
    addProductToQuoteRequestFail,
    addBasketToQuoteRequestFail,
    updateQuoteRequestItemsFail,
    deleteItemFromQuoteRequestFail
  ),
  on(loadQuoteRequestsSuccess, (state: QuoteRequestState, action) => {
    const quoteRequests = action.payload.quoteRequests;

    if (!state) {
      return;
    }

    return {
      ...quoteRequestAdapter.setAll(quoteRequests, state),
      loading: false,
    };
  }),
  on(loadQuoteRequestItemsSuccess, (state: QuoteRequestState, action) => {
    const quoteRequestItems = action.payload.quoteRequestItems;

    return {
      ...state,
      quoteRequestItems,
      loading: false,
    };
  }),
  on(
    addQuoteRequestSuccess,
    updateQuoteRequestSuccess,
    deleteQuoteRequestSuccess,
    submitQuoteRequestSuccess,
    createQuoteRequestFromQuoteRequestSuccess,
    addProductToQuoteRequestSuccess,
    addBasketToQuoteRequestSuccess,
    updateQuoteRequestItemsSuccess,
    deleteItemFromQuoteRequestSuccess,
    (state: QuoteRequestState) => ({
      ...state,
      loading: false,
      error: undefined,
    })
  )
);
