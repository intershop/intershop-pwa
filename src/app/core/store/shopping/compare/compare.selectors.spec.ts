import { CompareState } from './compare.reducer';
import { getCompareProductsSKUs, isInCompareProducts } from './compare.selectors';

describe('Compare Selectors', () => {
  describe('getCompareList', () => {
    it('should return the SKU list when queried', () => {
      const state: CompareState = {
        products: ['123', '456'],
      };
      const result = getCompareProductsSKUs.projector(state);
      const expected = state.products;
      expect(result).toBe(expected);
    });
  });

  describe('isInCompareList', () => {
    it('should say that SKU is in the list if it is', () => {
      const list = ['123', '456'];
      const result = isInCompareProducts('123').projector(list);
      expect(result).toBeTrue();
    });

    it("should say that SKU is not in the list if it isn't", () => {
      const list = ['123', '456'];
      const result = isInCompareProducts('789').projector(list);
      expect(result).toBeFalse();
    });
  });
});
