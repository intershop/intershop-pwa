import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LoadPromotionFail, LoadPromotionSuccess } from './promotions.actions';
import { getPromotion, getPromotionEntities, getPromotions } from './promotions.selectors';

describe('Promotions Selectors', () => {
  let store$: TestStore;

  let promo: Promotion;
  let promo1: Promotion;

  beforeEach(() => {
    promo = { id: 'id' } as Promotion;
    promo1 = { id: 'id1' } as Promotion;

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          shopping: combineReducers(shoppingReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any promotions when used', () => {
      expect(getPromotionEntities(store$.state)).toBeEmpty();
    });
  });

  describe('loading a promotion', () => {
    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
      });

      it('should put the promotion to the state', () => {
        expect(getPromotionEntities(store$.state)).toEqual({ [promo.id]: promo });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(
          new LoadPromotionFail({ error: { message: 'error' } as HttpError, promoId: 'erroneous_promo' })
        );
      });

      it('should not have loaded promotion on error', () => {
        expect(getPromotionEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a promotion', () => {
    beforeEach(() => {
      store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
      store$.dispatch(new LoadPromotionSuccess({ promotion: promo1 }));
    });

    describe('but no current router state', () => {
      it('should return the promotion information when used', () => {
        expect(getPromotionEntities(store$.state)).toMatchInlineSnapshot(`
          Object {
            "id": Object {
              "id": "id",
            },
            "id1": Object {
              "id": "id1",
            },
          }
        `);
      });

      it('should return a promotion stub if promotion is selected', () => {
        expect(getPromotion()(store$.state, { promoId: promo.id })).toMatchInlineSnapshot(`
          Object {
            "id": "id",
          }
        `);
        expect(getPromotions()(store$.state, { promotionIds: [promo.id, promo1.id] })).toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "id",
            },
            Object {
              "id": "id1",
            },
          ]
        `);
      });
    });
  });
});
