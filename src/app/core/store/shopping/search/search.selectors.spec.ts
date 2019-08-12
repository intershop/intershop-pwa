import { SearchState, initialState } from './search.reducer';
import { getSearchTerm } from './search.selectors';

describe('Search Selectors', () => {
  const state: SearchState = {
    ...initialState,
    searchTerm: 'a',
  };

  describe('getSearchTerm', () => {
    it('should return the search term if given', () => {
      const result = getSearchTerm.projector(state);
      const expected = state.searchTerm;
      expect(result).toBe(expected);
    });
  });
});
