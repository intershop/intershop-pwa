import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Promotion } from '../../../models/promotion/promotion.model';
import { shoppingReducers } from '../../../store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';

import { LoadPromotion, LoadPromotionFail, LoadPromotionSuccess } from './promotions.actions';
import {
  getPromotionEntities,
  getPromotionLoading,
  getPromotions,
  getSelectedPromotionId,
} from './promotions.selectors';

describe('Promotions Selectors', () => {
  let store$: TestStore;

  let promo: Promotion;

  beforeEach(() => {
    promo = { id: 'id' } as Promotion;

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any promotions when used', () => {
      expect(getPromotions(store$.state)).toBeEmpty();
      expect(getPromotionEntities(store$.state)).toBeEmpty();
      expect(getPromotionLoading(store$.state)).toBeFalse();
    });

    it('should not select a current promotion when used', () => {
      expect(getSelectedPromotionId(store$.state)).toBeUndefined();
    });
  });

  describe('loading a promotion', () => {
    beforeEach(() => {
      store$.dispatch(new LoadPromotion({ id: '' }));
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
        store$.dispatch(new LoadPromotionFail({ error: { message: 'error' } as HttpError, id: 'invalid' }));
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
        expect(getPromotions(store$.state)).toEqual([promo]);
        expect(getPromotionEntities(store$.state)).toEqual({ [promo.id]: promo });
        expect(getPromotionLoading(store$.state)).toBeFalse();
      });
    });

    it('should not select the irrelevant promotion when used', () => {
      expect(getSelectedPromotionId(store$.state)).toBeUndefined();
    });
  });
});
