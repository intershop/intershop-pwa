import { initialState, SearchState } from './search.reducer';
import { getSearchLoading, getSearchTerm } from './search.selectors';

describe('Search Selectors', () => {
  const state: SearchState = {
    ...initialState,
    searchTerm: 'a',
  };

  describe('getSearchLoading', () => {
    it('should return the loading state if given', () => {
      const result = getSearchLoading.projector(state);
      const expected = state.loading;
      expect(result).toBe(expected);
    });
  });

  describe('getSearchTerm', () => {
    it('should return the search term if given', () => {
      const result = getSearchTerm.projector(state);
      const expected = state.searchTerm;
      expect(result).toBe(expected);
    });
  });
});
