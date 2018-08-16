import { createSelector } from '@ngrx/store';

import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteHelper } from '../../../models/quote/quote.helper';
import { Quote } from '../../../models/quote/quote.model';
import { getProductEntities } from '../../../shopping/store/products';
import { getQuotingState } from '../quoting.state';

const getQuoteState = createSelector(getQuotingState, state => state.quote);

export const getSelectedQuoteId = createSelector(getQuoteState, state => state.selected);

export const getCurrentQuotes = createSelector(getQuoteState, state => {
  const quotes: Quote[] = [];

  for (const item of state.quotes) {
    quotes.push({
      ...item,
      state: QuoteHelper.getQuoteState(item),
    });
  }

  return quotes;
});

/**
 * Select the selected quote with the appended product data if available.
 */
export const getSelectedQuote = createSelector(
  createSelector(getCurrentQuotes, getSelectedQuoteId, (items, id) => items.filter(item => item.id === id).pop()),
  getProductEntities,
  (quote, products) =>
    !quote
      ? undefined
      : {
          ...quote,
          state: QuoteHelper.getQuoteState(quote),
          items: quote.items.map((item: QuoteRequestItem) => ({
            ...item,
            product: item.productSKU ? products[item.productSKU] : undefined,
          })),
        }
);

export const getQuoteLoading = createSelector(getQuoteState, state => state.loading);

export const getQuoteError = createSelector(getQuoteState, state => state.error);
