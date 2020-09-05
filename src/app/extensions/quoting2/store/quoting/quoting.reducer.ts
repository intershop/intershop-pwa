import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuotingEntity } from '../../models/quoting/quoting.model';

import {
  addQuoteToBasket,
  addQuoteToBasketSuccess,
  createQuoteRequestFromBasket,
  createQuoteRequestFromBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteSuccess,
  deleteQuotingEntity,
  deleteQuotingEntityFail,
  deleteQuotingEntitySuccess,
  loadQuoting,
  loadQuotingDetail,
  loadQuotingDetailSuccess,
  loadQuotingFail,
  loadQuotingSuccess,
  rejectQuote,
  rejectQuoteFail,
  submitQuoteRequest,
} from './quoting.actions';

export const quotingAdapter = createEntityAdapter<QuotingEntity>({
  sortComparer: QuotingHelper.sort,
});

export interface QuotingState extends EntityState<QuotingEntity> {
  loading: number;
  error: HttpError;
}

const initialState: QuotingState = quotingAdapter.getInitialState({
  loading: 0,
  error: undefined,
});

export const quotingReducer = createReducer(
  initialState,
  setLoadingOn(
    loadQuoting,
    loadQuotingDetail,
    deleteQuotingEntity,
    rejectQuote,
    addQuoteToBasket,
    createQuoteRequestFromQuote,
    createQuoteRequestFromBasket,
    submitQuoteRequest
  ),
  unsetLoadingAndErrorOn(
    loadQuotingSuccess,
    loadQuotingDetailSuccess,
    deleteQuotingEntitySuccess,
    addQuoteToBasketSuccess,
    createQuoteRequestFromQuoteSuccess,
    createQuoteRequestFromBasketSuccess
  ),
  setErrorOn(loadQuotingFail, deleteQuotingEntityFail, rejectQuoteFail),
  on(loadQuotingSuccess, (state, action) => quotingAdapter.upsertMany(action.payload.quoting, state)),
  on(
    loadQuotingDetailSuccess,
    createQuoteRequestFromQuoteSuccess,
    createQuoteRequestFromBasketSuccess,
    (state, action) => quotingAdapter.upsertOne(action.payload.quote, state)
  ),
  on(deleteQuotingEntitySuccess, (state, action) => quotingAdapter.removeOne(action.payload.id, state))
);
