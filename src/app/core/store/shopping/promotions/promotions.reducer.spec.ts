import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadPromotion, loadPromotionFail, loadPromotionSuccess } from './promotions.actions';
import { PromotionsState, initialState, promotionsReducer } from './promotions.reducer';

describe('Promotions Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<typeof loadPromotion | typeof loadPromotionFail | typeof loadPromotionSuccess>;
      const state = promotionsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadPromotion actions', () => {
    describe('LoadPromotionFail action', () => {
      let state: PromotionsState;

      beforeEach(() => {
        const action = loadPromotionFail({ error: makeHttpError({}), promoId: 'erroneous_promo' });
        state = promotionsReducer(initialState, action);
      });

      it('should lead to an empty entities set', () => {
        expect(state.entities).toBeEmpty();
      });

      describe('followed by LoadPromotionSuccess', () => {
        beforeEach(() => {
          const promotion = { id: 'successfull_promo' } as Promotion;
          const action = loadPromotionSuccess({ promotion });
          state = promotionsReducer(initialState, action);
        });

        it('should always put the promotion in the entities set', () => {
          expect(state.entities).toHaveProperty('successfull_promo');
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
        const action = loadPromotionSuccess({ promotion });
        const state = promotionsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[promotion.id]).toEqual(promotion);
      });

      it('should update promotion if already exists', () => {
        const action1 = loadPromotionSuccess({ promotion });
        const state1 = promotionsReducer(initialState, action1);

        const updatedPromotion = { id: '111' } as Promotion;
        updatedPromotion.name = 'Updated promotion name';
        updatedPromotion.title = 'Updated promotion title';

        const action2 = loadPromotionSuccess({ promotion: updatedPromotion });
        const state2 = promotionsReducer(state1, action2);

        expect(state2.ids).toHaveLength(1);
        expect(state2.entities[promotion.id]).toEqual(updatedPromotion);
      });
    });
  });
});
