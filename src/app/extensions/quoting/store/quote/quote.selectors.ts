import { createSelector } from '@ngrx/store';

import { getProductEntities } from 'ish-core/store/shopping/products';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteHelper } from '../../models/quote/quote.helper';
import { QuoteData } from '../../models/quote/quote.interface';
import { getQuotingState } from '../quoting-store';

import { initialState, quoteAdapter } from './quote.reducer';

const getQuoteState = createSelector(
  getQuotingState,
  state => (state ? state.quote : initialState)
);

const { selectAll, selectEntities } = quoteAdapter.getSelectors(getQuoteState);

export const getSelectedQuoteId = createSelector(
  getQuoteState,
  state => state.selected
);

export const getSelectedQuote = createSelector(
  getSelectedQuoteId,
  selectEntities,
  (id, entities) => entities && id && addStateToQuote(entities[id])
);

export const getCurrentQuotes = createSelector(
  selectAll,
  quotes => quotes.map(addStateToQuote)
);

/**
 * Select the selected quote with the appended product data if available.
 */
export const getSelectedQuoteWithProducts = createSelector(
  getSelectedQuote,
  getProductEntities,
  (quote, products) =>
    !quote
      ? undefined
      : {
          ...quote,
          items: quote.items.map((item: QuoteRequestItem) => ({
            ...item,
            product: item.productSKU ? products[item.productSKU] : undefined,
          })),
        }
);

export const getQuoteLoading = createSelector(
  getQuoteState,
  state => state.loading
);

export const getQuoteError = createSelector(
  getQuoteState,
  state => state.error
);

function addStateToQuote(quote: QuoteData) {
  return (
    quote && {
      ...quote,
      state: QuoteHelper.getQuoteState(quote),
    }
  );
}
