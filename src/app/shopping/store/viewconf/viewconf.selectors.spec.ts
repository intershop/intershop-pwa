import { ViewconfState } from './viewconf.reducer';
import * as fromSelectors from './viewconf.selectors';

describe('CompareListSelectors', () => {

  describe('getSortBy', () => {
    it('should return the sortBy setting when queried', () => {
      const state: ViewconfState = {
        sortBy: 'name-asc',
        viewType: 'grid',
        sortByOptions: []
      };
      const result = fromSelectors.getSortBy.projector(state);
      const expected = state.sortBy;
      expect(result).toBe(expected);
    });
  });

  describe('getViewType', () => {
    it('should return the sortBy setting when queried', () => {
      const state: ViewconfState = {
        sortBy: 'name-asc',
        viewType: 'grid',
        sortByOptions: []
      };
      const result = fromSelectors.getViewType.projector(state);
      const expected = state.viewType;
      expect(result).toBe(expected);
    });
  });

});
