import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OciConfigurationItem } from '../../models/oci-configuration-item/oci-configuration-item.model';

import { ociConfigurationActions, ociConfigurationActionsApiActions } from './oci-configuration.actions';

export interface OciConfigurationState {
  config: OciConfigurationItem[];
  loading: boolean;
  error: HttpError;
}

const initialState: OciConfigurationState = {
  config: [],
  loading: false,
  error: undefined,
};

export const ociConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(ociConfigurationActions.loadOciConfiguration, ociConfigurationActions.updateOciConfiguration),
  unsetLoadingAndErrorOn(
    ociConfigurationActionsApiActions.loadOciConfigurationSuccess,
    ociConfigurationActionsApiActions.updateOciConfigurationSuccess
  ),
  setErrorOn(
    ociConfigurationActionsApiActions.loadOciConfigurationFail,
    ociConfigurationActionsApiActions.updateOciConfigurationFail
  ),
  on(
    ociConfigurationActionsApiActions.loadOciConfigurationSuccess,
    ociConfigurationActionsApiActions.loadOciConfigurationSuccess,
    (state, { payload: { ociConfiguration } }): OciConfigurationState => ({
      ...state,
      config: ociConfiguration,
    })
  )
);
