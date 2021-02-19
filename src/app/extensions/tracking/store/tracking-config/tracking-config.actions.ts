import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const setGTMToken = createAction(
  '[Configuration] Set Google Tag Manager Token',
  payload<{ gtmToken: string }>()
);
