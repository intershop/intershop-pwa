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
