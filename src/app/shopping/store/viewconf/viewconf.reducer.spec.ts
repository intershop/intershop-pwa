import * as fromActions from './viewconf.actions';
import * as fromReducer from './viewconf.reducer';

describe('Viewconf Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const { initialState } = fromReducer;
      const action = {} as fromActions.ViewconfAction;
      const state = fromReducer.viewconfReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  it('should set the viewtype for ChangeViewType action', () => {
    const { initialState } = fromReducer;
    const action = new fromActions.ChangeViewType('list');
    const state = fromReducer.viewconfReducer(initialState, action);

    expect(state.viewType).toEqual('list');
  });

  it('should set the sortBy setting for ChangeSortBy action', () => {
    const { initialState } = fromReducer;
    const action = new fromActions.ChangeSortBy('name-asc');
    const state = fromReducer.viewconfReducer(initialState, action);

    expect(state.sortBy).toEqual('name-asc');
  });
});
