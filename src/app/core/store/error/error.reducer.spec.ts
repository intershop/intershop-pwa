import * as using from 'jasmine-data-provider';
import { RouteNavigation } from 'ngrx-router';
import { anything } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LoginUserSuccess } from 'ish-core/store/user';

import { CommunicationTimeoutError, ErrorActionTypes, HttpErrorAction } from './error.actions';
import { errorReducer, initialState } from './error.reducer';

describe('Error Reducer', () => {
  describe('initialState', () => {
    it('should not have an error when unmodified', () => {
      expect(initialState.current).toBeUndefined();
    });

    it('should not have a type when unmodified', () => {
      expect(initialState.type).toBeFalsy();
    });
  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = errorReducer(undefined, {} as HttpErrorAction);

      expect(newState).toEqual(initialState);
    });
  });

  function dataProvider() {
    return [
      {
        state: initialState,
        action: {} as HttpErrorAction,
        expected: initialState,
      },
      {
        state: initialState,
        action: new CommunicationTimeoutError({ error: {} as HttpError }),
        expected: { current: {}, type: ErrorActionTypes.TimeoutError },
      },
      {
        state: initialState,
        action: new LoginUserSuccess(anything()),
        expected: initialState,
      },
      {
        state: { current: {}, type: ErrorActionTypes.TimeoutError },
        action: new RouteNavigation({ path: 'error' }),
        expected: { current: {}, type: ErrorActionTypes.TimeoutError },
      },
    ];
  }

  using(dataProvider, dataSlice => {
    it(`should return ${
      dataSlice.expected === initialState ? ' initialState' : ` '${dataSlice.expected.type}'`
    } when Action ${dataSlice.action.type} is reduced on state ${dataSlice.state.type}`, () => {
      const newState = errorReducer(dataSlice.state, dataSlice.action);
      expect(newState).toEqual(dataSlice.expected);
    });
  });
});
