import * as using from 'jasmine-data-provider';
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
    using(
      [
        { page: 0, total: 2, itemsPerPage: 1, expected: true },
        { page: 0, total: 2, itemsPerPage: 2, expected: false },
        { page: 0, total: 2, itemsPerPage: 3, expected: false },
      ],
      slice => {
        it(`should validate for ${slice}`, () => {
          expect(fromSelectors.canRequestMore.projector(slice.page, slice.itemsPerPage, slice.total)).toEqual(
            slice.expected
          );
        });
      }
    );
  });
});
