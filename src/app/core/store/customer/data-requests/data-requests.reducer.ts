import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  confirmGDPRDataRequest,
  confirmGDPRDataRequestFail,
  confirmGDPRDataRequestSuccess,
} from './data-requests.actions';

export interface DataRequestsState {
  loading: boolean;
  error: HttpError;
  firstGDPRDataRequest: boolean;
}

const initialState: DataRequestsState = {
  loading: false,
  error: undefined,
  firstGDPRDataRequest: true,
};

export const dataRequestsReducer = createReducer(
  initialState,
  setLoadingOn(confirmGDPRDataRequest),
  unsetLoadingOn(confirmGDPRDataRequestSuccess, confirmGDPRDataRequestFail),
  setErrorOn(confirmGDPRDataRequestFail),

  on(
    confirmGDPRDataRequestSuccess,
    (state, action): DataRequestsState => ({
      ...state,
      firstGDPRDataRequest: action.payload.infoCode === 'gdpr_request.confirmed.info',
    })
  )
);
