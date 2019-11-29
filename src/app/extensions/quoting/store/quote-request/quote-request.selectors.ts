import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { getProductEntities } from 'ish-core/store/shopping/products';

import { QuoteRequestHelper } from '../../models/quote-request/quote-request.helper';
import { getQuotingState } from '../quoting-store';

import { initialState } from './quote-request.reducer';

const getQuoteRequestState = createSelector(
  getQuotingState,
  state => (state ? state.quoteRequest : initialState)
);

export const getSelectedQuoteRequestId = createSelector(
  getQuoteRequestState,
  state => state.selected
);

export const getCurrentQuoteRequests = createSelector(
  getQuoteRequestState,
  state =>
    state.quoteRequests.map(item => ({
      ...item,
      state: QuoteRequestHelper.getQuoteRequestState(item),
    }))
);

export const getQuoteRequstItems = createSelector(
  getQuoteRequestState,
  state => state.quoteRequestItems
);

export const getActiveQuoteRequest = createSelector(
  createSelector(
    getCurrentQuoteRequests,
    quoteRequests => quoteRequests.filter(item => item.editable).pop() || undefined
  ),
  getQuoteRequstItems,
  getProductEntities,
  (quoteRequest, quoteRequestItems, products) =>
    !quoteRequest
      ? undefined
      : {
          ...quoteRequest,
          state: QuoteRequestHelper.getQuoteRequestState(quoteRequest),
          items: quoteRequestItems.map(item => ({
            ...item,
            product: item.productSKU ? products[item.productSKU] : undefined,
          })),
        }
);

/**
 * Select the selected quote request with the appended line item and product data if available.
 */
export const getSelectedQuoteRequest = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(
  createSelector(
    getCurrentQuoteRequests,
    getSelectedQuoteRequestId,
    (items, id) => items.filter(item => item.id === id).pop()
  ),
  getQuoteRequstItems,
  getProductEntities,
  (quote, quoteRequestItems, products) =>
    !quote
      ? undefined
      : {
          ...quote,
          state: QuoteRequestHelper.getQuoteRequestState(quote),
          items: quoteRequestItems.map(item => ({
            ...item,
            product: item.productSKU ? products[item.productSKU] : undefined,
          })),
        }
);

export const getQuoteRequestLoading = createSelector(
  getQuoteRequestState,
  state => state.loading
);

export const getQuoteRequestError = createSelector(
  getQuoteRequestState,
  state => state.error
);
