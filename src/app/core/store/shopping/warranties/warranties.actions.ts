import { createActionGroup } from '@ngrx/store';

import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const warrantyActions = createActionGroup({
  source: 'Warranties',
  events: {
    'Load Warranty': payload<{ warrantyId: string }>(),
  },
});

export const warrantyApiActions = createActionGroup({
  source: 'Warranties API',
  events: {
    'Load Warranty Success': payload<{ warranty: Warranty }>(),
    'Load Warranty Fail': httpError<{}>(),
  },
});
