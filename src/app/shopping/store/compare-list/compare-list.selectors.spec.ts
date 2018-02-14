import { CompareListState } from './compare-list.reducer';
import * as fromSelectors from './compare-list.selectors';

describe('CompareListSelectors', () => {

  describe('getCompareList', () => {
    it('should return the SKU list when queried', () => {
      const state: CompareListState = {
        skus: ['123', '456']
      };
      const result = fromSelectors.getCompareList.projector(state);
      const expected = state.skus;

      expect(result).toBe(expected);
    });
  });

  describe('isInCompareList', () => {
    it('should say that SKU is in the list if it is', () => {
      const list = ['123', '456'];
      const result = fromSelectors.isInCompareList('123').projector(list);
      expect(result).toBe(true);
    });

    it('should say that SKU is not in the list if it isn\'t', () => {
      const list = ['123', '456'];
      const result = fromSelectors.isInCompareList('789').projector(list);
      expect(result).toBe(false);
    });
  });
});
