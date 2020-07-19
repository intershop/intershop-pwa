import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadPromotion, loadPromotionFail, loadPromotionSuccess } from './promotions.actions';
import { PromotionsEffects } from './promotions.effects';

describe('Promotions Effects', () => {
  let actions$: Observable<Action>;
  let effects: PromotionsEffects;
  let promotionsServiceMock: PromotionsService;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of({ id } as Promotion);
      }
    });

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }])],
      providers: [
        PromotionsEffects,
        provideMockActions(() => actions$),
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    effects = TestBed.inject(PromotionsEffects);
  });

  describe('loadPromotion$', () => {
    it('should call the promotionsService for LoadPromotion action', done => {
      const promoId = 'P123';
      const action = loadPromotion({ promoId });
      actions$ = of(action);

      effects.loadPromotion$.subscribe(() => {
        verify(promotionsServiceMock.getPromotion(promoId)).once();
        done();
      });
    });

    it('should map to action of type LoadPromotionSuccess only once', () => {
      const id = 'P123';
      const promoId = 'P123';
      const action = loadPromotion({ promoId });
      const completion = loadPromotionSuccess({ promotion: { id } as Promotion });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c----', { c: completion });

      expect(effects.loadPromotion$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadPromotionFail only once', () => {
      const promoId = 'invalid';
      const action = loadPromotion({ promoId });
      const completion = loadPromotionFail({ error: makeHttpError({ message: 'invalid' }), promoId });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c----', { c: completion });

      expect(effects.loadPromotion$).toBeObservable(expected$);
    });
  });
});
