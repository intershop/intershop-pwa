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

      expect(state.loading).toEqual(true);
    });
  });

  describe('SearchProductsSuccess action', () => {
    it('should set skus and search loading to false', () => {
      const skus = ['9780321934161', '0818279012576'];
      const action = new SearchProductsSuccess({ searchTerm: 'search', products: skus });
      const state = searchReducer(initialState, action);

      expect(state.loading).toEqual(false);
      expect(state.products).toEqual(skus);
    });
  });
});
