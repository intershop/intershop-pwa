import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CxmlConfiguration } from '../../models/cxml-configuration/cxml-configuration.model';

import { cxmlConfigurationActions, cxmlConfigurationApiActions } from './cxml-configuration.actions';

export interface CxmlConfigurationState {
  configuration: CxmlConfiguration[];
  loading: boolean;
  error: HttpError;
}

const initialState: CxmlConfigurationState = {
  configuration: [],
  loading: false,
  error: undefined,
};

export const cxmlConfigurationReducer = createReducer(
  initialState,
  setLoadingOn(cxmlConfigurationActions.loadCXMLConfiguration, cxmlConfigurationActions.updateCXMLConfiguration),
  unsetLoadingAndErrorOn(
    cxmlConfigurationApiActions.loadCXMLConfigurationSuccess,
    cxmlConfigurationApiActions.updateCXMLConfigurationSuccess
  ),
  setErrorOn(
    cxmlConfigurationApiActions.loadCXMLConfigurationFail,
    cxmlConfigurationApiActions.updateCXMLConfigurationFail
  ),
  on(
    cxmlConfigurationApiActions.loadCXMLConfigurationSuccess,
    cxmlConfigurationApiActions.updateCXMLConfigurationSuccess,
    (state, { payload: { configuration } }): CxmlConfigurationState => ({
      ...state,
      configuration,
    })
  ),
  on(cxmlConfigurationActions.resetCXMLConfiguration, (): CxmlConfigurationState => initialState)
);
