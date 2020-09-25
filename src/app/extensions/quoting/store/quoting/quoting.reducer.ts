import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuotingEntity } from '../../models/quoting/quoting.model';

import {
  addProductToQuoteRequest,
  addProductToQuoteRequestSuccess,
  addQuoteToBasket,
  addQuoteToBasketSuccess,
  createQuoteRequestFromBasket,
  createQuoteRequestFromBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestSuccess,
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
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestSuccess,
} from './quoting.actions';

export const quotingAdapter = createEntityAdapter<QuotingEntity>({
  sortComparer: QuotingHelper.sort,
});

export interface QuotingInternalState extends EntityState<QuotingEntity> {
  loading: number;
  error: HttpError;
  activeQuoteRequest: string;
  initialized: boolean;
}

const initialState: QuotingInternalState = quotingAdapter.getInitialState({
  loading: 0,
  error: undefined,
  activeQuoteRequest: undefined,
  initialized: false,
});

export const quotingReducer = createReducer(
  initialState,
  // loading and error status
  setLoadingOn(
    loadQuoting,
    loadQuotingDetail,
    deleteQuotingEntity,
    rejectQuote,
    addQuoteToBasket,
    createQuoteRequestFromQuote,
    createQuoteRequestFromQuoteRequest,
    createQuoteRequestFromBasket,
    submitQuoteRequest,
    addProductToQuoteRequest,
    updateQuoteRequest
  ),
  unsetLoadingAndErrorOn(
    loadQuotingSuccess,
    loadQuotingDetailSuccess,
    deleteQuotingEntitySuccess,
    addQuoteToBasketSuccess,
    createQuoteRequestFromQuoteSuccess,
    createQuoteRequestFromQuoteRequestSuccess,
    createQuoteRequestFromBasketSuccess,
    submitQuoteRequestSuccess,
    addProductToQuoteRequestSuccess,
    updateQuoteRequestSuccess
  ),
  setErrorOn(loadQuotingFail, deleteQuotingEntityFail, rejectQuoteFail),
  // initialized
  on(loadQuotingSuccess, state => ({ ...state, initialized: true })),
  // entities
  on(loadQuotingSuccess, (state, action) =>
    action.payload.quoting.reduce(
      (acc, val) =>
        !acc.entities[val.id]
          ? // add if entity does not exist
            quotingAdapter.addOne(val, acc)
          : acc.entities[val.id].type !== val.type
          ? // overwrite when type changes on server
            quotingAdapter.setOne(val, acc)
          : // no change by default
            acc,
      state
    )
  ),
  on(
    loadQuotingDetailSuccess,
    createQuoteRequestFromQuoteSuccess,
    createQuoteRequestFromQuoteRequestSuccess,
    createQuoteRequestFromBasketSuccess,
    submitQuoteRequestSuccess,
    addProductToQuoteRequestSuccess,
    updateQuoteRequestSuccess,
    (state, action) => quotingAdapter.upsertOne(action.payload.entity, state)
  ),
  on(deleteQuotingEntitySuccess, (state, action) => quotingAdapter.removeOne(action.payload.id, state)),
  // active quote request
  on(addProductToQuoteRequest, state => ({ ...state, activeQuoteRequest: undefined })),
  on(addProductToQuoteRequestSuccess, createQuoteRequestFromQuoteRequestSuccess, (state, action) => ({
    ...state,
    activeQuoteRequest: action.payload.entity.id,
  }))
);
