// tslint:disable:no-any
import { TestBed } from '@angular/core/testing';
import { Action, Selector, createSelector } from '@ngrx/store';

import { TestStore, ngrxTesting } from './dev/ngrx-testing';
import { firstTruthy } from './selectors';

describe('Selectors', () => {
  let store: TestStore;
  const getState = (state: any) => state.state;

  beforeEach(() => {
    function reducer(state = {}, action: { type: string; payload: { [id: string]: string } }) {
      return { ...state, ...action.payload };
    }
    TestBed.configureTestingModule({
      imports: ngrxTesting({ state: reducer }),
    });

    store = TestBed.get(TestStore);
  });

  describe('self-test', () => {
    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should be empty when no action was dispatched', () => {
      expect(store.state).toEqual({ state: {} });
      expect(getState(store.state)).toBeEmpty();
    });

    it('should reduce when given actions', () => {
      store.dispatch({ type: 'dummy', payload: { key: 'value' } } as Action);
      expect(getState(store.state)).not.toBeEmpty();
    });

    it('should select a value when key is selected', () => {
      store.dispatch({ type: 'dummy', payload: { key: 'value' } } as Action);
      const getKey = createSelector(getState, (state: any) => state.key);
      expect(getKey(store.state)).toEqual('value');
    });
  });

  describe('firstTruthy', () => {
    let getFirst: Selector<any, string>;
    let getSecond: Selector<any, string>;

    beforeEach(() => {
      getFirst = createSelector(getState, (state: any) => state.first);
      getSecond = createSelector(getState, (state: any) => state.second);
    });

    it('should select the first if both are available', () => {
      store.dispatch({ type: 'dummy', payload: { first: '1', second: '2' } } as Action);
      expect(firstTruthy(getFirst, getSecond)(store.state)).toEqual('1');
    });

    it('should select the first if only it is available', () => {
      store.dispatch({ type: 'dummy', payload: { first: '1' } } as Action);
      expect(firstTruthy(getFirst, getSecond)(store.state)).toEqual('1');
    });

    it('should select the second if only it is available', () => {
      store.dispatch({ type: 'dummy', payload: { second: '2' } } as Action);
      expect(firstTruthy(getFirst, getSecond)(store.state)).toEqual('2');
    });
  });
});
