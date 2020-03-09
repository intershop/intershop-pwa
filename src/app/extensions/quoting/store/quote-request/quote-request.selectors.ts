import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { getCategoryTree } from 'ish-core/store/shopping/categories';
import { getProductEntities } from 'ish-core/store/shopping/products';

import { QuoteRequestHelper } from '../../models/quote-request/quote-request.helper';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';
import { getQuotingState } from '../quoting-store';

import { initialState, quoteRequestAdapter } from './quote-request.reducer';

const getQuoteRequestState = createSelector(
  getQuotingState,
  state => (state ? state.quoteRequest : initialState)
);

const { selectAll, selectEntities } = quoteRequestAdapter.getSelectors(getQuoteRequestState);

export const getSelectedQuoteRequestId = createSelector(
  getQuoteRequestState,
  state => state.selected
);

export const getSelectedQuoteRequest = createSelector(
  selectEntities,
  getSelectedQuoteRequestId,
  (entities, id) => id && addStateToQuoteRequest(entities[id])
);

export const getCurrentQuoteRequests = createSelector(
  selectAll,
  quoteRequests => quoteRequests.map(addStateToQuoteRequest)
);

export const getQuoteRequestItems = createSelector(
  getQuoteRequestState,
  state => state.quoteRequestItems
);

export const getQuoteRequestItemsWithProducts = createSelector(
  getQuoteRequestItems,
  getProductEntities,
  getCategoryTree,
  (items, products, categoryTree) =>
    items.map(item => ({
      ...item,
      product: item.productSKU ? createProductView(products[item.productSKU], categoryTree) : undefined,
    }))
);

export const getActiveQuoteRequest = createSelector(
  getCurrentQuoteRequests,
  quoteRequests => {
    const quoteRequest = quoteRequests.reverse().find(item => item.editable);
    return addStateToQuoteRequest(quoteRequest);
  }
);

export const getActiveQuoteRequestWithProducts = createSelector(
  getActiveQuoteRequest,
  getQuoteRequestItemsWithProducts,
  (quoteRequest, items) => quoteRequest && { ...quoteRequest, items }
);

/**
 * Select the selected quote request with the appended line item and product data if available.
 */
export const getSelectedQuoteRequestWithProducts = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getSelectedQuoteRequest, getQuoteRequestItemsWithProducts, (quote, items) => quote && { ...quote, items });

export const getQuoteRequestLoading = createSelector(
  getQuoteRequestState,
  state => state.loading
);

export const getQuoteRequestError = createSelector(
  getQuoteRequestState,
  state => state.error
);

function addStateToQuoteRequest(quote: QuoteRequestData) {
  return (
    quote && {
      ...quote,
      state: QuoteRequestHelper.getQuoteRequestState(quote),
    }
  );
}
