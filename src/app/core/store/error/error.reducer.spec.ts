import { HttpErrorResponse } from '@angular/common/http';
import * as using from 'jasmine-data-provider';
import { RouteNavigation } from 'ngrx-router';
import { anything } from 'ts-mockito';
import { CreateUserSuccess } from '../user';
import { CommunicationTimeoutError, ErrorActionTypes, HttpError } from './error.actions';
import { errorReducer, initialState } from './error.reducer';

describe('Error Reducer', () => {
  describe('initialState', () => {
    it('should not have a error when unmodified', () => {
      expect(initialState.current).toBeUndefined();
    });

    it('should not have an type when unmodified', () => {
      expect(initialState.type).toBeFalsy();
    });
  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = errorReducer(undefined, {} as HttpError);

      expect(newState).toEqual(initialState);
    });
  });

  function dataProvider() {
    return [
      {
        state: initialState,
        action: {} as HttpError,
        expected: initialState,
      },
      {
        state: initialState,
        action: new CommunicationTimeoutError({} as HttpErrorResponse),
        expected: { current: {}, type: ErrorActionTypes.TimeoutError },
      },
      {
        state: initialState,
        action: new CreateUserSuccess(anything()),
        expected: initialState,
      },
      {
        state: { current: {}, type: ErrorActionTypes.TimeoutError },
        action: new RouteNavigation({ path: 'error', params: {}, queryParams: {} }),
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
