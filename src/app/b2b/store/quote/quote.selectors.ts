import { createSelector } from '@ngrx/store';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import { getProductEntities } from '../../../shopping/store/products';
import { getB2bState } from '../b2b.state';

const getQuoteState = createSelector(getB2bState, state => state.quote);

export const getSelectedQuoteId = createSelector(getQuoteState, state => state.selected);

export const getCurrentQuoteRequests = createSelector(getQuoteState, state => state.quoteRequests);

export const getCurrentQuotes = createSelector(getQuoteState, state => {
  const quotes: (Quote | QuoteRequest)[] = [...state.quoteRequests, ...state.quotes];
  return quotes;
});

export const getQuoteRequstItems = createSelector(getQuoteState, state => state.quoteRequestItems);

/**
 * Select the selected quote with the appended line item and product data if available.
 */
export const getSelectedQuote = createSelector(
  createSelector(getCurrentQuotes, getSelectedQuoteId, (items, id) => items.filter(item => item.id === id).pop()),
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

export const getActiveQuoteRequest = createSelector(getQuoteState, state => {
  return state.quoteRequests.filter(item => item.editable === true).pop() || null;
});

export const getQuoteLoading = createSelector(getQuoteState, state => state.loading);

export const getQuoteError = createSelector(getQuoteState, state => state.error);
