import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const setActiveTool = createAction('[Copilot] Set Active Tool', payload<{ tool: string }>());
