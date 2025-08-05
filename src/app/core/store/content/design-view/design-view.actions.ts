import { createActionGroup } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

// not-dead-code
export const designViewActions = createActionGroup({
  source: 'Design View',
  events: {
    'Select Pagelet': payload<{ pageletId: string }>(),
  },
});
