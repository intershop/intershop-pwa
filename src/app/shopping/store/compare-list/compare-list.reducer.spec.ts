import * as fromActions from './compare-list.actions';
import * as fromReducer from './compare-list.reducer';

describe('CompareListReducer', () => {
  describe('undefined action', () => {
    it('should return the default state when queried with undefined state', () => {
      const { initialState } = fromReducer;
      const action = {} as any;
      const state = fromReducer.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('AddToCompareList action', () => {
    it('should add SKU to compare list', () => {
      const sku = '1234567';
      const action = new fromActions.AddToCompareList(sku);
      const state = fromReducer.reducer(fromReducer.initialState, action);

      expect(state.skus).toContain(sku);
    });
  });

  describe('RemoveFromCompareList action', () => {
    it('should remove SKU from compare list when requested', () => {
      const sku = '1234567';

      const initialState = {
        ...fromReducer.initialState,
        skus: ['123', sku]
      };
      const action = new fromActions.RemoveFromCompareList(sku);
      const state = fromReducer.reducer(initialState, action);

      expect(state.skus).not.toContain(sku);
    });
  });
});

