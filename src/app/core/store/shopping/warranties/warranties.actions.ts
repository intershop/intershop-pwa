import { createAction } from '@ngrx/store';

import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadWarranty = createAction('[Warranties] Load Warranty', payload<{ warrantyId: string }>());

export const loadWarrantyFail = createAction('[Warranties API] Load Warranties Fail', httpError());

export const loadWarrantySuccess = createAction(
  '[Warranties API] Load Warranties Success',
  payload<{ warranty: Warranty }>()
);
