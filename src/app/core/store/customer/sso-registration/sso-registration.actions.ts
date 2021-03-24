import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const setRegistrationInfo = createAction(
  '[SsoRegistration] Set Registration Info',
  payload<{ companyInfo: { companyName1: string; companyName2: string; taxationID: string }; address: Address }>()
);

export const deleteRegistrationInfo = createAction('[SsoRegistration] Delete Registration Info');
