import { SearchAction, SearchProducts, SearchProductsSuccess } from './search.actions';
import { initialState, searchReducer } from './search.reducer';

describe('Search Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as SearchAction;
      const state = searchReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SearchProducts actions', () => {
    it('should set search loading to true', () => {
      const term = 'gopro';
      const action = new SearchProducts(term);
      const state = searchReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('SearchProductsSuccess action', () => {
    it('should set loading to false', () => {
      const action = new SearchProductsSuccess('search');
      const state = searchReducer(initialState, action);

      expect(state.loading).toBeFalse();
    });
  });
});
