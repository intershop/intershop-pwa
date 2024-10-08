import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const setGMAKey = createAction('[Stores Internal] Set GMA Key', payload<{ gmaKey: string }>());
