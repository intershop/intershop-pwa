import { createAction } from '@ngrx/store';

import { DataRequest, DataRequestConfirmation } from 'ish-core/models/data-request/data-request.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const confirmGDPRDataRequest = createAction(
  '[DataRequest API] Confirm GDPR Data Request',
  payload<{ data: DataRequest }>()
);

export const confirmGDPRDataRequestSuccess = createAction(
  '[DataRequest API] Confirm GDPR Data Request Success',
  payload<DataRequestConfirmation>()
);

export const confirmGDPRDataRequestFail = createAction(
  '[DataRequest API] Confirm GDPR Data Request Failed',
  httpError()
);
