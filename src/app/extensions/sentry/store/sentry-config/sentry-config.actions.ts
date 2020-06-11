import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const setSentryConfig = createAction('[Sentry] Set Config', payload<{ dsn: string }>());
