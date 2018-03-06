import { HttpErrorResponse } from '@angular/common/http';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import * as using from 'jasmine-data-provider';
import { anything } from 'ts-mockito/lib/ts-mockito';
import { CreateUserSuccess } from '../user';
import { CommunicationTimeoutError, ErrorActionTypes } from './error.actions';
import { generalErrorReducer, initialState } from './error.reducer';

describe('Error Reducer', () => {

  describe('initialState', () => {
    it('should not have a error when unmodified', () => {
      expect(initialState.current).toBeNull();
    });

    it('should not have an type when unmodified', () => {
      expect(initialState.type).toBeFalsy();
    });

  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = generalErrorReducer(undefined, {} as any);

      expect(newState).toEqual(initialState);
    });

  });

  function dataProvider() {
    return [
      {
        state: initialState,
        action: {} as any,
        expected: initialState
      },
      {
        state: initialState,
        action: new CommunicationTimeoutError({} as HttpErrorResponse),
        expected: { current: {}, type: ErrorActionTypes.TimeoutError }
      },
      {
        state: initialState,
        action: new CreateUserSuccess(anything()),
        expected: initialState
      },
      {
        state: { current: {}, type: ErrorActionTypes.TimeoutError },
        action: { type: ROUTER_NAVIGATION, payload: { routerState: { url: '/error' } } },
        expected: { current: {}, type: ErrorActionTypes.TimeoutError }
      }

    ];
  }

  using(dataProvider, (dataSlice) => {
    it(`should return ${dataSlice.expected === initialState ? ' initialState' : (' \'' + dataSlice.expected.type + '\' ')} when Action ${dataSlice.action.type} is reduced on state ${dataSlice.state.type}`, () => {
      const newState = generalErrorReducer(dataSlice.state, dataSlice.action);
      expect(newState).toEqual(dataSlice.expected);
    });
  });
});
