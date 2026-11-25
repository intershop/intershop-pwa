import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { AiSearchConfig } from '../../models/ai-search-config/ai-search-config.model';

export const aiSearchConfigInternalActions = createActionGroup({
  source: 'AI Search Config Internal',
  events: {
    'Load Config': emptyProps(),
    'Set Config': payload<{ config: AiSearchConfig }>(),
  },
});
