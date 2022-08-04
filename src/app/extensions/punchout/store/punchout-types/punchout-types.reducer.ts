import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { PunchoutType } from '../../models/punchout-user/punchout-user.model';

import { loadPunchoutTypes, loadPunchoutTypesFail, loadPunchoutTypesSuccess } from './punchout-types.actions';

export interface PunchoutTypesState {
  types: PunchoutType[];
  loading: boolean;
  error: HttpError;
}

const initialState: PunchoutTypesState = {
  types: [],
  loading: false,
  error: undefined,
};

export const punchoutTypesReducer = createReducer(
  initialState,
  setLoadingOn(loadPunchoutTypes),
  unsetLoadingAndErrorOn(loadPunchoutTypesSuccess),
  setErrorOn(loadPunchoutTypesFail),
  on(
    loadPunchoutTypesSuccess,
    (state, action): PunchoutTypesState => ({
      ...state,
      types: action.payload.types,
    })
  )
);
