import { TestBed } from '@angular/core/testing';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadPromotionFail, loadPromotionSuccess } from './promotions.actions';
import { getPromotion, getPromotions } from './promotions.selectors';

describe('Promotions Selectors', () => {
  let store$: StoreWithSnapshots;

  let promo: Promotion;
  let promo1: Promotion;

  beforeEach(() => {
    promo = { id: 'id' } as Promotion;
    promo1 = { id: 'id1' } as Promotion;

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('promotions')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any promotions when used', () => {
      expect(getPromotions([promo.id, promo1.id])(store$.state)).toBeEmpty();
    });
  });

  describe('loading a promotion', () => {
    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadPromotionSuccess({ promotion: promo }));
      });

      it('should put the promotion to the state', () => {
        expect(getPromotion(promo.id)(store$.state)).toEqual(promo);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadPromotionFail({ error: makeHttpError({ message: 'error' }), promoId: 'erroneous_promo' }));
      });

      it('should not have loaded promotion on error', () => {
        expect(getPromotions([promo.id, promo1.id])(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a promotion', () => {
    beforeEach(() => {
      store$.dispatch(loadPromotionSuccess({ promotion: promo }));
      store$.dispatch(loadPromotionSuccess({ promotion: promo1 }));
    });

    describe('but no current router state', () => {
      it('should return a promotion stub if promotion is selected', () => {
        expect(getPromotion(promo.id)(store$.state)).toMatchInlineSnapshot(`
          Object {
            "id": "id",
          }
        `);
        expect(getPromotions([promo.id, promo1.id])(store$.state)).toMatchInlineSnapshot(`
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
