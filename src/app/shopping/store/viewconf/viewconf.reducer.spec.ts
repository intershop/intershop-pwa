import * as fromActions from './viewconf.actions';
import { initialState, viewconfReducer } from './viewconf.reducer';

describe('Viewconf Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.ViewconfAction;
      const state = viewconfReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  it('should set the viewtype for ChangeViewType action', () => {
    const action = new fromActions.ChangeViewType('list');
    const state = viewconfReducer(initialState, action);

    expect(state.viewType).toEqual('list');
  });

  it('should set the sortBy setting for ChangeSortBy action', () => {
    const action = new fromActions.ChangeSortBy('name-asc');
    const state = viewconfReducer(initialState, action);

    expect(state.sortBy).toEqual('name-asc');
  });
});
