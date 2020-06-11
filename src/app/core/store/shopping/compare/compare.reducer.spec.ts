import { addToCompare, removeFromCompare, toggleCompare } from './compare.actions';
import { compareReducer, initialState } from './compare.reducer';

describe('Compare Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when queried with undefined state', () => {
      const action = {} as ReturnType<typeof addToCompare | typeof removeFromCompare | typeof toggleCompare>;
      const state = compareReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('AddToCompare action', () => {
    it('should add SKU to compare state for the given SKU', () => {
      const sku = '1234567';
      const action = addToCompare({ sku });
      const state = compareReducer(initialState, action);

      expect(state.products).toContain(sku);
    });
  });

  describe('RemoveFromCompare action', () => {
    it('should remove SKU from compare state for the given SKU', () => {
      const sku = '1234567';

      const previousState = {
        ...initialState,
        products: ['123', sku],
      };
      const action = removeFromCompare({ sku });
      const state = compareReducer(previousState, action);

      expect(state.products).not.toContain(sku);
    });
  });
});
