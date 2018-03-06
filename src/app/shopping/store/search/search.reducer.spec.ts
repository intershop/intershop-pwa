import { DoSearch, SearchProductsAvailable } from './search.actions';
import { initialState, searchReducer } from './search.reducer';

describe('Products Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as any;
      const state = searchReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('DoSearch actions', () => {
    it('should set search term and search loading to true', () => {
      const term = 'gopro';
      const action = new DoSearch(term);
      const state = searchReducer(initialState, action);

      expect(state.searchLoading).toEqual(true);
      expect(state.searchTerm).toEqual(term);
    });
  });

  describe('SearchProductsAvailable action', () => {
    it('should set skus and search loading to false', () => {
      const skus = ['9780321934161', '0818279012576'];
      const action = new SearchProductsAvailable(skus);
      const state = searchReducer(initialState, action);

      expect(state.searchLoading).toEqual(false);
      expect(state.skus).toEqual(skus);
    });
  });

});
