import { HttpError } from '../../../models/http-error/http-error.model';
import { Promotion } from '../../../models/promotion/promotion.model';

import * as fromActions from './promotions.actions';
import { PromotionsState, initialState, promotionsReducer } from './promotions.reducer';

describe('Promotions Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.PromotionsAction;
      const state = promotionsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadPromotion actions', () => {
    describe('LoadPromotion action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadPromotion({ promoId: '123' });
        const state = promotionsReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadPromotionFail action', () => {
      let state: PromotionsState;

      beforeEach(() => {
        const action = new fromActions.LoadPromotionFail({ error: {} as HttpError, promoId: 'invalid' });
        state = promotionsReducer(initialState, action);
      });

      it('should set loading to false and add promotion to failed list', () => {
        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
        expect(state.failed).toIncludeAllMembers(['invalid']);
      });

      describe('followed by LoadPromotionSuccess', () => {
        beforeEach(() => {
          const promotion = { id: 'invalid' } as Promotion;
          const action = new fromActions.LoadPromotionSuccess({ promotion });
          state = promotionsReducer(initialState, action);
        });

        it('should set loading to false and remove promotion from failed list', () => {
          expect(state.loading).toBeFalse();
          expect(state.entities).toHaveProperty('invalid');
          expect(state.failed).toBeEmpty();
        });
      });
    });

    describe('LoadPromotionSuccess action', () => {
      let promotion: Promotion;

      beforeEach(() => {
        promotion = {
          id: '111',
          name: 'Test promotion name',
          title: 'Test promotion title',
        } as Promotion;
      });

      it('should insert promotion if not exists', () => {
        const action = new fromActions.LoadPromotionSuccess({ promotion });
        const state = promotionsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[promotion.id]).toEqual(promotion);
      });

      it('should update promotion if already exists', () => {
        const action1 = new fromActions.LoadPromotionSuccess({ promotion });
        const state1 = promotionsReducer(initialState, action1);

        const updatedPromotion = { id: '111' } as Promotion;
        updatedPromotion.name = 'Updated promotion name';
        updatedPromotion.title = 'Updated promotion title';

        const action2 = new fromActions.LoadPromotionSuccess({ promotion: updatedPromotion });
        const state2 = promotionsReducer(state1, action2);

        expect(state2.ids).toHaveLength(1);
        expect(state2.entities[promotion.id]).toEqual(updatedPromotion);
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadPromotionSuccess({ promotion });
        const state = promotionsReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });
});
