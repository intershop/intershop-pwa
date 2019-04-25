import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Promotion } from '../../../models/promotion/promotion.model';
import { shoppingReducers } from '../../../store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';

import { LoadPromotion, LoadPromotionFail, LoadPromotionSuccess } from './promotions.actions';
import { getPromotion, getPromotionEntities, getPromotionLoading, getPromotions } from './promotions.selectors';

describe('Promotions Selectors', () => {
  let store$: TestStore;

  let promo: Promotion;
  let promo1: Promotion;

  beforeEach(() => {
    promo = { id: 'id' } as Promotion;
    promo1 = { id: 'id1' } as Promotion;

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any promotions when used', () => {
      expect(getPromotionEntities(store$.state)).toBeEmpty();
      expect(getPromotionLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading a promotion', () => {
    beforeEach(() => {
      store$.dispatch(new LoadPromotion({ promoId: '' }));
    });

    it('should set the state to loading', () => {
      expect(getPromotionLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
      });

      it('should set loading to false', () => {
        expect(getPromotionLoading(store$.state)).toBeFalse();
        expect(getPromotionEntities(store$.state)).toEqual({ [promo.id]: promo });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadPromotionFail({ error: { message: 'error' } as HttpError, promoId: 'invalid' }));
      });

      it('should not have loaded promotion on error', () => {
        expect(getPromotionLoading(store$.state)).toBeFalse();
        expect(getPromotionEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a promotion', () => {
    beforeEach(() => {
      store$.dispatch(new LoadPromotionSuccess({ promotion: promo }));
    });

    describe('but no current router state', () => {
      it('should return the promotion information when used', () => {
        expect(getPromotionEntities(store$.state)).toEqual({ [promo.id]: promo });
        expect(getPromotionLoading(store$.state)).toBeFalse();
      });

      it('should return a promotion stub if promotion is selected', () => {
        expect(getPromotion(store$.state, { promoId: promo.id })).toBeTruthy();
        expect(getPromotions(store$.state, { promotionIds: [promo.id, promo1.id] })).toBeTruthy();
      });
    });
  });
});
