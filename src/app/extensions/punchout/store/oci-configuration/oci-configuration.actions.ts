import { createActionGroup, emptyProps } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OciConfigurationItem } from '../../models/oci-configuration-item/oci-configuration-item.model';
import { OciOptions } from '../../models/oci-options/oci-options.model';

export const ociConfigurationActions = createActionGroup({
  source: 'OCI Configuration',
  events: {
    'Load OCI Options And Configuration': emptyProps(),
    'Load OCI Configuration': emptyProps(),
    'Load OCI Configuration Options': emptyProps(),
    'Update OCI Configuration': payload<{ configuration: OciConfigurationItem[] }>(),
  },
});

export const ociConfigurationApiActions = createActionGroup({
  source: 'OCI Configuration API',
  events: {
    'Load OCI Configuration Success': payload<{ configuration: OciConfigurationItem[] }>(),
    'Load OCI Configuration Fail': httpError<{}>(),
    'Load OCI Configuration Options Success': payload<{ options: OciOptions }>(),
    'Load OCI Configuration Options Fail': httpError<{}>(),
    'Update OCI Configuration Success': payload<{ configuration: OciConfigurationItem[] }>(),
    'Update OCI Configuration Fail': httpError<{}>(),
  },
});
