import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { QuoteRequestUpdate } from '../../models/quote-request-update/quote-request-update.model';
import { QuoteCompletenessLevel, QuotingEntity } from '../../models/quoting/quoting.model';

interface EntityPayloadType {
  entity: QuotingEntity;
}

interface IdPayloadType {
  id: string;
}

interface ChangesPayloadType extends IdPayloadType {
  changes: QuoteRequestUpdate[];
}

export const loadQuoting = createAction('[Quoting] Load Quoting');

export const loadQuotingFail = createAction('[Quoting API] Load Quoting Fail', httpError());

export const loadQuotingSuccess = createAction(
  '[Quoting API] Load Quoting Success',
  payload<{ quoting: QuotingEntity[] }>()
);

export const loadQuotingDetail = createAction(
  '[Quoting] Load Quoting Detail',
  payload<EntityPayloadType & { level: QuoteCompletenessLevel }>()
);

export const loadQuotingDetailSuccess = createAction(
  '[Quoting API] Load Quoting Detail Success',
  payload<EntityPayloadType>()
);

export const deleteQuotingEntity = createAction('[Quoting] Delete Quoting Entity', payload<EntityPayloadType>());

export const deleteQuotingEntityFail = createAction(
  '[Quoting API] Delete Quoting Entity Fail',
  httpError<IdPayloadType>()
);

export const deleteQuotingEntitySuccess = createAction(
  '[Quoting API] Delete Quoting Entity Success',
  payload<IdPayloadType>()
);

export const rejectQuote = createAction('[Quoting] Reject Quote', payload<IdPayloadType>());

export const rejectQuoteFail = createAction('[Quoting API] Reject Quote Fail', httpError<IdPayloadType>());

export const addQuoteToBasket = createAction('[Quoting] Add Quote To Basket', payload<IdPayloadType>());

export const addQuoteToBasketSuccess = createAction(
  '[Quoting API] Add Quote To Basket Success',
  payload<IdPayloadType>()
);

export const createQuoteRequestFromQuote = createAction(
  '[Quoting] Create Quote Request From Quote',
  payload<IdPayloadType>()
);

export const createQuoteRequestFromQuoteSuccess = createAction(
  '[Quoting API] Create Quote Request From Quote Success',
  payload<EntityPayloadType>()
);

export const createQuoteRequestFromQuoteRequest = createAction(
  '[Quoting] Create Quote Request From Quote Request',
  payload<IdPayloadType>()
);

export const createQuoteRequestFromQuoteRequestSuccess = createAction(
  '[Quoting API] Create Quote Request From Quote Request Success',
  payload<EntityPayloadType>()
);

export const submitQuoteRequest = createAction('[Quoting] Submit Quote Request', payload<IdPayloadType>());

export const submitQuoteRequestSuccess = createAction(
  '[Quoting API] Submit Quote Request Success',
  payload<EntityPayloadType>()
);

export const createQuoteRequestFromBasket = createAction('[Quoting] Create Quote Request From Basket');

export const createQuoteRequestFromBasketSuccess = createAction(
  '[Quoting API] Create Quote Request From Basket Success',
  payload<EntityPayloadType>()
);

export const addProductToQuoteRequest = createAction(
  '[Quoting] Add Product To Quote Request',
  payload<{ sku: string; quantity: number }>()
);

export const addProductToQuoteRequestSuccess = createAction(
  '[Quoting API] Add Product To Quote Request Success',
  payload<EntityPayloadType>()
);

export const updateQuoteRequest = createAction('[Quoting] Update Quote Request', payload<ChangesPayloadType>());

export const updateQuoteRequestSuccess = createAction(
  '[Quoting API] Update Quote Request Success',
  payload<EntityPayloadType>()
);
