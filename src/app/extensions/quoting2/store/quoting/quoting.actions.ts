import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { QuoteCompletenessLevel, QuotingEntity } from '../../models/quoting/quoting.model';

export const loadQuoting = createAction('[Quoting] Load Quoting');

export const loadQuotingFail = createAction('[Quoting API] Load Quoting Fail', httpError());

export const loadQuotingSuccess = createAction(
  '[Quoting API] Load Quoting Success',
  payload<{ quoting: QuotingEntity[] }>()
);

export const loadQuotingDetail = createAction(
  '[Quoting] Load Quoting Detail',
  payload<{ entity: QuotingEntity; level: QuoteCompletenessLevel }>()
);

export const loadQuotingDetailSuccess = createAction(
  '[Quoting API] Load Quoting Detail Success',
  payload<{ quote: QuotingEntity }>()
);

export const deleteQuotingEntity = createAction(
  '[Quoting] Delete Quoting Entity',
  payload<{ entity: QuotingEntity }>()
);

export const deleteQuotingEntityFail = createAction(
  '[Quoting API] Delete Quoting Entity Fail',
  httpError<{ id: string }>()
);

export const deleteQuotingEntitySuccess = createAction(
  '[Quoting API] Delete Quoting Entity Success',
  payload<{ id: string }>()
);

export const rejectQuote = createAction('[Quoting] Reject Quote', payload<{ quoteId: string }>());

export const rejectQuoteFail = createAction('[Quoting API] Reject Quote Fail', httpError<{ id: string }>());

export const addQuoteToBasket = createAction('[Quoting] Add Quote To Basket', payload<{ quoteId: string }>());

export const addQuoteToBasketSuccess = createAction(
  '[Quoting API] Add Quote To Basket Success',
  payload<{ quoteId: string }>()
);

export const createQuoteRequestFromQuote = createAction(
  '[Quoting] Create Quote Request From Quote',
  payload<{ quoteId: string }>()
);

export const createQuoteRequestFromQuoteSuccess = createAction(
  '[Quoting API] Create Quote Request From Quote Success',
  payload<{ quote: QuotingEntity }>()
);

export const submitQuoteRequest = createAction('[Quoting] Submit Quote Request', payload<{ quoteRequestId: string }>());

export const createQuoteRequestFromBasket = createAction('[Quoting] Create Quote Request From Basket');

export const createQuoteRequestFromBasketSuccess = createAction(
  '[Quoting API] Create Quote Request From Basket Success',
  payload<{ quote: QuotingEntity }>()
);
