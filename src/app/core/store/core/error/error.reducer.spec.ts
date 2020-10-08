import { Action } from '@ngrx/store';
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

  it(`should return initialState when Action undefined is reduced on initial state`, () => {
    const newState = errorReducer(initialState, {} as Action);
    expect(newState).toEqual(initialState);
  });

  it(`should return Timeout Error when Action Timeout Error is reduced on initial state`, () => {
    const action = communicationTimeoutError({ error: makeHttpError({}) });
    const newState = errorReducer(initialState, action);
    expect(newState).toEqual({ current: { name: 'HttpErrorResponse' }, type: communicationTimeoutError.type });
  });

  it(`should return initialState when Action Login User Success is reduced on initial state`, () => {
    const action = loginUserSuccess(anything());
    const newState = errorReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
