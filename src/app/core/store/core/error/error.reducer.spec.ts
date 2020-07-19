import { Action } from '@ngrx/store';
import * as using from 'jasmine-data-provider';
import { anything } from 'ts-mockito';

import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { communicationTimeoutError } from './error.actions';
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
      const newState = errorReducer(undefined, {} as Action);

      expect(newState).toEqual(initialState);
    });
  });

  function dataProvider() {
    return [
      {
        state: initialState,
        action: {},
        expected: initialState,
      },
      {
        state: initialState,
        action: communicationTimeoutError({ error: makeHttpError({}) }),
        expected: { current: { name: 'HttpErrorResponse' }, type: communicationTimeoutError.type },
      },
      {
        state: initialState,
        action: loginUserSuccess(anything()),
        expected: initialState,
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
