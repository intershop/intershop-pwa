import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { CoreStoreModule } from 'ish-core/store/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { LoadPromotionFail, LoadPromotionSuccess } from './promotions.actions';
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
      expect(getPromotions()(store$.state, { promotionIds: [promo.id, promo1.id] })).toBeEmpty();
    });
  });

  describe('loading a promotion', () => {
    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
      });

      it('should put the promotion to the state', () => {
        expect(getPromotion()(store$.state, { promoId: promo.id })).toEqual(promo);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(
          new LoadPromotionFail({ error: { message: 'error' } as HttpError, promoId: 'erroneous_promo' })
        );
      });

      it('should not have loaded promotion on error', () => {
        expect(getPromotions()(store$.state, { promotionIds: [promo.id, promo1.id] })).toBeEmpty();
      });
    });
  });

  describe('state with a promotion', () => {
    beforeEach(() => {
      store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
      store$.dispatch(new LoadPromotionSuccess({ promotion: promo1 }));
    });

    describe('but no current router state', () => {
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
