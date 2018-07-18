import { ViewconfState } from './viewconf.reducer';
import * as fromSelectors from './viewconf.selectors';

describe('Viewconf Selectors', () => {
  describe('getSortBy', () => {
    it('should return the sortBy setting when queried', () => {
      const state = {
        sortBy: 'name-asc',
        viewType: 'grid',
        sortKeys: [],
      } as ViewconfState;
      const result = fromSelectors.getSortBy.projector(state);
      const expected = state.sortBy;
      expect(result).toBe(expected);
    });
  });

  describe('getViewType', () => {
    it('should return the sortBy setting when queried', () => {
      const state = {
        sortBy: 'name-asc',
        viewType: 'grid',
        sortKeys: [],
      } as ViewconfState;
      const result = fromSelectors.getViewType.projector(state);
      const expected = state.viewType;
      expect(result).toBe(expected);
    });
  });

  describe('canSearchForMore', () => {
    let state: ViewconfState;

    beforeEach(() => {
      state = {
        page: 0,
        total: 2,
      } as ViewconfState;
    });

    it('should return true when page size is smaller than total size', () => {
      expect(fromSelectors.canRequestMore(1).projector(state)).toBeTrue();
    });

    it('should return false when page size is equal to total size', () => {
      expect(fromSelectors.canRequestMore(2).projector(state)).toBeFalse();
    });

    it('should return false when page size is greater than total size', () => {
      expect(fromSelectors.canRequestMore(3).projector(state)).toBeFalse();
    });
  });
});
