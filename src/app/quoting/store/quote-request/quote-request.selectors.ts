import { createSelector } from '@ngrx/store';
import { QuoteRequestHelper } from '../../../models/quote-request/quote-request.helper';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { getProductEntities } from '../../../shopping/store/products';
import { getQuotingState } from '../quoting.state';

const getQuoteRequestState = createSelector(getQuotingState, state => state.quoteRequest);

export const getSelectedQuoteRequestId = createSelector(getQuoteRequestState, state => state.selected);

export const getCurrentQuoteRequests = createSelector(getQuoteRequestState, state => {
  const quoteRequests: QuoteRequest[] = [];

  for (const item of state.quoteRequests) {
    quoteRequests.push({
      ...item,
      state: QuoteRequestHelper.getQuoteRequestState(item),
    });
  }

  return quoteRequests;
});

export const getQuoteRequstItems = createSelector(getQuoteRequestState, state => state.quoteRequestItems);

export const getActiveQuoteRequest = createSelector(getQuoteRequestState, state => {
  const quoteRequest = state.quoteRequests.filter(item => item.editable).pop() || undefined;
  if (quoteRequest) {
    return {
      ...quoteRequest,
      state: QuoteRequestHelper.getQuoteRequestState(quoteRequest),
    } as QuoteRequest;
  }

  return;
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

export const getQuoteRequestLoading = createSelector(getQuoteRequestState, state => state.loading);

export const getQuoteRequestError = createSelector(getQuoteRequestState, state => state.error);
