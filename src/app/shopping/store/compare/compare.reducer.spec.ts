import * as fromActions from './compare.actions';
import * as fromReducer from './compare.reducer';

describe('CompareReducer', () => {
  describe('undefined action', () => {
    it('should return the default state when queried with undefined state', () => {
      const { initialState } = fromReducer;
      const action = {} as any;
      const state = fromReducer.compareReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('AddToCompare action', () => {
    it('should add SKU to compare state for the given SKU', () => {
      const sku = '1234567';
      const action = new fromActions.AddToCompare(sku);
      const state = fromReducer.compareReducer(fromReducer.initialState, action);

      expect(state.skus).toContain(sku);
    });
  });

  describe('RemoveFromCompare action', () => {
    it('should remove SKU from compare state for the given SKU', () => {
      const sku = '1234567';

      const initialState = {
        ...fromReducer.initialState,
        skus: ['123', sku]
      };
      const action = new fromActions.RemoveFromCompare(sku);
      const state = fromReducer.compareReducer(initialState, action);

      expect(state.skus).not.toContain(sku);
    });
  });
});

