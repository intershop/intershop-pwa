import { createSelector } from '@ngrx/store';
import { getProductEntities } from '../../../shopping/store/products';
import { getQuotingState } from '../quoting.state';

const getQuoteRequestState = createSelector(getQuotingState, state => state.quoteRequest);

export const getSelectedQuoteRequestId = createSelector(getQuoteRequestState, state => state.selected);

export const getCurrentQuoteRequests = createSelector(getQuoteRequestState, state => state.quoteRequests);

export const getQuoteRequstItems = createSelector(getQuoteRequestState, state => state.quoteRequestItems);

export const getActiveQuoteRequest = createSelector(getQuoteRequestState, state => {
  return state.quoteRequests.filter(item => item.editable === true).pop() || null;
});

/**
 * Select the selected quote request with the appended line item and product data if available.
 */
export const getSelectedQuoteRequest = createSelector(
  createSelector(getCurrentQuoteRequests, getSelectedQuoteRequestId, (items, id) =>
    items.filter(item => item.id === id).pop()
  ),
  getQuoteRequstItems,
  getProductEntities,
  (quote, quoteRequestItems, products) =>
    !quote
      ? null
      : {
          ...quote,
          items: quoteRequestItems.map(item => ({
            ...item,
            product: item.productSKU ? products[item.productSKU] : undefined,
          })),
        }
);

export const getQuoteRequestLoading = createSelector(getQuoteRequestState, state => state.loading);

export const getQuoteRequestError = createSelector(getQuoteRequestState, state => state.error);
