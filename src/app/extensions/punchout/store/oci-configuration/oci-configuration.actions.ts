import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OciConfiguration } from '../../models/oci-configuration/oci-configuration.model';

export const loadOciConfigurations = createAction('[Punchout] Load Oci Configurations');

export const loadOciConfigurationsFail = createAction('[Punchout API] Load Oci Configurations Fail', httpError());

export const loadOciConfigurationsSuccess = createAction(
  '[Punchout API] Load Oci Configurations Success',
  payload<{ ociConfigurations: OciConfiguration[] }>()
);

export const updateOciConfiguration = createAction(
  '[Punchout] Update Oci Configurations',
  payload<{ ociConfiguration: OciConfiguration }>()
);

export const updateOciConfigurationFail = createAction('[Punchout API] Update Oci Configurations Fail', httpError());

export const updateOciConfigurationSuccess = createAction(
  '[Punchout API] Update Oci Configurations Success',
  payload<{ ociConfiguration: OciConfiguration }>()
);
