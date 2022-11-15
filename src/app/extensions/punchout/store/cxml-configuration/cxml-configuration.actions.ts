import { createActionGroup } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';

export const cxmlConfigurationActions = createActionGroup({
  source: 'Cxml Configuration',
  events: {
    'Load CXML Configuration': payload<void>(),
    'Update CXML Configuration': payload<{ configuration: CxmlConfiguration[] }>(),
    'Reset CXML Configuration': payload<void>(),
  },
});

export const cxmlConfigurationApiActions = createActionGroup({
  source: 'CXML Configuration API',
  events: {
    'Load CXML Configuration Success': payload<{ configuration: CxmlConfiguration[] }>(),
    'Load CXML Configuration Fail': httpError<{}>(),
    'Update CXML Configuration Success': payload<{ configuration: CxmlConfiguration[] }>(),
    'Update CXML Configuration Fail': httpError<{}>(),
  },
});
