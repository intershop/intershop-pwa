import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

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
  resetQuoteError,
  selectQuote,
} from './quote.actions';

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

export const quoteReducer = createReducer(
  initialState,
  on(selectQuote, (state: QuoteState, action) => ({
    ...state,
    selected: action.payload.id,
  })),
  setLoadingOn(loadQuotes, deleteQuote, rejectQuote, createQuoteRequestFromQuote, addQuoteToBasket),
  setErrorOn(loadQuotesFail, deleteQuoteFail, rejectQuoteFail, createQuoteRequestFromQuoteFail, addQuoteToBasketFail),
  on(loadQuotesSuccess, (state: QuoteState, action) => {
    const quotes = action.payload.quotes;
    if (!state) {
      return;
    }

    return {
      ...quoteAdapter.setAll(quotes, state),
      loading: false,
    };
  }),
  on(
    deleteQuoteSuccess,
    rejectQuoteSuccess,
    createQuoteRequestFromQuoteSuccess,
    addQuoteToBasketSuccess,
    (state: QuoteState) => ({
      ...state,
      loading: false,
    })
  ),
  on(resetQuoteError, (state: QuoteState) => ({
    ...state,
    error: undefined,
  }))
);
