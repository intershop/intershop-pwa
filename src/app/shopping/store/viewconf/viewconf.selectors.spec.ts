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
        { page: 1, total: 7, itemsPerPage: 3, expected: true },
        { page: 1, total: 6, itemsPerPage: 3, expected: false },
        { page: 1, total: 4, itemsPerPage: 3, expected: false },
        { page: 1, total: 3, itemsPerPage: 3, expected: false },
      ],
      slice => {
        it(`should validate for ${JSON.stringify(slice)}`, () => {
          expect(fromSelectors.canRequestMore.projector(slice.page, slice.itemsPerPage, slice.total)).toEqual(
            slice.expected
          );
        });
      }
    );
  });

  describe('isEveryProductDisplayed', () => {
    using(
      [
        { total: 2, products: new Array(2), expected: true },
        { total: 2, products: new Array(3), expected: true },
        { total: 2, products: new Array(0), expected: false },
      ],
      slice => {
        it(`should validate for ${JSON.stringify(slice)}`, () => {
          expect(fromSelectors.isEveryProductDisplayed.projector(slice.total, slice.products)).toEqual(slice.expected);
        });
      }
    );
  });

  describe('getPageIndices', () => {
    using(
      [
        { total: 2, itemsPerPage: 1, expected: [1, 2] },
        { total: 2, itemsPerPage: 2, expected: [1] },
        { total: 2, itemsPerPage: 3, expected: [1] },
        { total: 2, itemsPerPage: 30, expected: [1] },
        { total: 20, itemsPerPage: 3, expected: [1, 2, 3, 4, 5, 6, 7] },
        { total: 21, itemsPerPage: 3, expected: [1, 2, 3, 4, 5, 6, 7] },
        { total: 22, itemsPerPage: 3, expected: [1, 2, 3, 4, 5, 6, 7, 8] },
      ],
      slice => {
        it(`should validate for ${JSON.stringify(slice)}`, () => {
          expect(fromSelectors.getPageIndices.projector(slice.total, slice.itemsPerPage)).toEqual(slice.expected);
        });
      }
    );
  });

  describe('isProductsAvailable', () => {
    it('should return true when sku list is not empty', () => {
      expect(fromSelectors.isProductsAvailable.projector(new Array(2))).toBeTrue();
    });

    it('should return false when sku list is empty', () => {
      expect(fromSelectors.isProductsAvailable.projector(new Array(0))).toBeFalse();
    });
  });
});
