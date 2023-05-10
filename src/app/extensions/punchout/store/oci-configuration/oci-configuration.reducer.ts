import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer } from '@ngrx/store';
import { on } from 'events';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OciConfigurationItem } from '../../models/oci-configuration/oci-configuration.model';

import {
  loadOciConfiguration,
  loadOciConfigurationFail,
  loadOciConfigurationSuccess,
  updateOciConfiguration,
  updateOciConfigurationFail,
  updateOciConfigurationSuccess,
} from './oci-configuration.actions';

export const ociConfigurationAdapter = createEntityAdapter<OciConfigurationItem>();

export interface OciConfigurationState extends EntityState<OciConfigurationItem> {
  loading: boolean;
  error: HttpError;
}

const initialState: OciConfigurationState = ociConfigurationAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const ociConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(loadOciConfiguration, updateOciConfiguration),
  unsetLoadingAndErrorOn(loadOciConfigurationSuccess, updateOciConfigurationSuccess),
  setErrorOn(loadOciConfigurationFail, updateOciConfigurationFail),
  //TODO: The on function will be fixed
  on(loadOciConfigurationSuccess, updateOciConfigurationSuccess, (state, action) =>
    ociConfigurationAdapter.upsertMany(action.payload.OciConfiguration, state)
  )
);
