import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OciConfigurationItem } from '../../models/oci-configuration-item/oci-configuration-item.model';
import { OciOptions } from '../../models/oci-options/oci-options.model';

import { ociConfigurationActions, ociConfigurationApiActions } from './oci-configuration.actions';

export interface OciConfigurationState {
  configuration: OciConfigurationItem[];
  loading: boolean;
  error: HttpError;
  options: OciOptions;
}

const initialState: OciConfigurationState = {
  configuration: [],
  options: undefined,
  loading: false,
  error: undefined,
};

export const ociConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(
    ociConfigurationActions.loadOciConfiguration,
    ociConfigurationActions.loadOciConfigurationOptions,
    ociConfigurationActions.updateOciConfiguration
  ),
  unsetLoadingAndErrorOn(
    ociConfigurationApiActions.loadOciConfigurationSuccess,
    ociConfigurationApiActions.loadOciConfigurationOptionsSuccess,
    ociConfigurationApiActions.updateOciConfigurationSuccess
  ),
  setErrorOn(
    ociConfigurationApiActions.loadOciConfigurationFail,
    ociConfigurationApiActions.loadOciConfigurationOptionsFail,
    ociConfigurationApiActions.updateOciConfigurationFail
  ),
  on(
    ociConfigurationApiActions.loadOciConfigurationSuccess,
    ociConfigurationApiActions.updateOciConfigurationSuccess,
    (state, { payload: { configuration } }): OciConfigurationState => ({
      ...state,
      configuration,
    })
  ),
  on(
    ociConfigurationApiActions.loadOciConfigurationOptionsSuccess,
    (state, { payload: { options } }): OciConfigurationState => ({
      ...state,
      options,
    })
  )
);
