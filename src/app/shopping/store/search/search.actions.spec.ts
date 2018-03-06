import { DoSearch, SearchActionTypes, SearchProductFail, SearchProductsAvailable } from './search.actions';

describe('Search Actions', () => {
  describe('DoSearch Action', () => {
    it('should create new action for DoSearch', () => {
      const payload = 'aaa';
      const action = new DoSearch(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.DoSearch,
        payload
      });
    });

    it('should create new action for SearchProductsAvailable', () => {
      const payload = ['a', 'b'];
      const action = new SearchProductsAvailable(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.SearchProductsAvailable,
        payload
      });
    });

    it('should create new action for SearchProductFail', () => {
      const payload = 'any';
      const action = new SearchProductFail(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.SearchProductFail,
        payload
      });
    });

  });
});
