import { createAction } from '@ngrx/store';

import { Link } from 'ish-core/models/link/link.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../models/quote/quote.interface';

export const selectQuote = createAction('[Quote Internal] Select Quote', payload<{ id: string }>());

export const loadQuotes = createAction('[Quote Internal] Load Quotes');

export const loadQuotesFail = createAction('[Quote API] Load Quotes Fail', httpError());

export const loadQuotesSuccess = createAction('[Quote API] Load Quotes Success', payload<{ quotes: QuoteData[] }>());

export const deleteQuote = createAction('[Quote] Delete Quote', payload<{ id: string }>());

export const deleteQuoteFail = createAction('[Quote API] Delete Quote Fail', httpError());

export const deleteQuoteSuccess = createAction('[Quote API] Delete Quote Success', payload<{ id: string }>());

export const rejectQuote = createAction('[Quote] Reject Quote');

export const rejectQuoteFail = createAction('[Quote API] Reject Quote Fail', httpError());

export const rejectQuoteSuccess = createAction('[Quote API] Reject Quote Success', payload<{ id: string }>());

export const createQuoteRequestFromQuote = createAction('[Quote] Create Quote Request from Quote');

export const createQuoteRequestFromQuoteFail = createAction(
  '[Quote API] Create Quote Request from Quote Fail',
  httpError()
);

export const createQuoteRequestFromQuoteSuccess = createAction(
  '[Quote API] Create Quote Request from Quote Success',
  payload<{ quoteLineItemRequest: QuoteLineItemResult }>()
);

export const addQuoteToBasket = createAction(
  '[Basket] Add Quote To Basket',
  payload<{ quoteId: string; basketId?: string }>()
);

export const addQuoteToBasketFail = createAction('[Basket API] Add Quote To Basket Fail', httpError());

export const addQuoteToBasketSuccess = createAction(
  '[Basket API] Add Quote To Basket Success',
  payload<{ link: Link }>()
);

export const resetQuoteError = createAction('[Quote] Reset Quote Error');
