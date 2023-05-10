import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OciConfigurationItem } from '../../models/oci-configuration/oci-configuration.model';

export const loadOciConfiguration = createAction('[Punchout] Load Oci Configuration');

export const loadOciConfigurationFail = createAction('[Punchout API] Load Oci Configuration Fail', httpError());

export const loadOciConfigurationSuccess = createAction(
  '[Punchout API] Load Oci Configuration Success',
  payload<{ ociConfiguration: OciConfigurationItem[] }>()
);

export const updateOciConfiguration = createAction(
  '[Punchout] Update Oci Configuration',
  payload<{ ociConfiguration: OciConfigurationItem[] }>()
);

export const updateOciConfigurationFail = createAction('[Punchout API] Update Oci Configuration Fail', httpError());

export const updateOciConfigurationSuccess = createAction(
  '[Punchout API] Update Oci Configuration Success',
  payload<{ ociConfiguration: OciConfigurationItem[] }>()
);
