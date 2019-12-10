import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { BasketActionTypes, LoadBasketSuccess, ResetBasket } from 'ish-core/store/checkout/basket';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadOrderSuccess, OrdersActionTypes } from 'ish-core/store/orders';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess, LogoutUser, SetAPIToken, UserActionTypes } from 'ish-core/store/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { RestoreEffects } from './restore.effects';

describe('Restore Effects', () => {
  let restoreEffects: RestoreEffects;
  let router: Router;
  let actions$: Observable<Action>;
  let cookiesServiceMock: CookiesService;
  let store$: TestStore;

  beforeEach(() => {
    cookiesServiceMock = mock(CookiesService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      providers: [
        RestoreEffects,
        provideMockActions(() => actions$),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: CookiesService, useFactory: () => instance(cookiesServiceMock) },
      ],
    });

    restoreEffects = TestBed.get(RestoreEffects);
    router = TestBed.get(Router);
    store$ = TestBed.get(TestStore);
  });

  it('should be created', () => {
    expect(restoreEffects).toBeTruthy();
  });

  describe('destroyTokenInCookieOnLogout$', () => {
    it('should destroy the cookie when user logs out', done => {
      actions$ = of(new LogoutUser());

      restoreEffects.destroyTokenInCookieOnLogout$.subscribe(() => {
        verify(cookiesServiceMock.remove('apiToken')).once();
        done();
      }, fail);
    });
  });

  describe('restoreUserOrBasketByToken$', () => {
    it('should do nothing when no cookie is available', done => {
      restoreEffects.restoreUserOrBasketOrOrderByToken$.subscribe(fail, fail, done);
      router.initialNavigation();
    });

    it('should trigger action for loading basket if basket token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: 'dummy', type: 'basket' }));

      restoreEffects.restoreUserOrBasketOrOrderByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', BasketActionTypes.LoadBasketByAPIToken);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        done();
      }, fail);
      router.initialNavigation();
    });

    it('should trigger action for loading user if user token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: 'dummy', type: 'user' }));

      restoreEffects.restoreUserOrBasketOrOrderByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', UserActionTypes.LoadUserByAPIToken);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        done();
      }, fail);
      router.initialNavigation();
    });

    it('should trigger action for loading order if order token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(
        JSON.stringify({ apiToken: 'dummy', type: 'order', orderId: '12345' })
      );

      restoreEffects.restoreUserOrBasketOrOrderByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', OrdersActionTypes.LoadOrderByAPIToken);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        expect(action).toHaveProperty('payload.orderId', '12345');
        done();
      }, fail);
      router.initialNavigation();
    });
  });

  describe('saveAPITokenToCookie$', () => {
    it('should not save token when neither basket nor user nor order is available', () => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));

      expect(restoreEffects.saveAPITokenToCookie$).toBeObservable(cold('-'));
    });

    it('should save basket token when basket is available', done => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));

      restoreEffects.saveAPITokenToCookie$.subscribe(
        () => {
          verify(cookiesServiceMock.put('apiToken', anyString(), anything())).once();
          const [, cookie] = capture(cookiesServiceMock.put).last();
          expect(cookie).toMatchInlineSnapshot(`"{\\"apiToken\\":\\"dummy\\",\\"type\\":\\"basket\\"}"`);
          done();
        },
        fail,
        fail
      );
    });

    it('should save user token when user is available', done => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(new LoginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

      restoreEffects.saveAPITokenToCookie$.subscribe(
        () => {
          verify(cookiesServiceMock.put('apiToken', anyString(), anything())).once();
          const [, cookie] = capture(cookiesServiceMock.put).last();
          expect(cookie).toMatchInlineSnapshot(`"{\\"apiToken\\":\\"dummy\\",\\"type\\":\\"user\\"}"`);
          done();
        },
        fail,
        fail
      );
    });

    it('should save user token when basket and user are available', done => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));
      store$.dispatch(new LoginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

      restoreEffects.saveAPITokenToCookie$.subscribe(
        () => {
          verify(cookiesServiceMock.put('apiToken', anyString(), anything())).once();
          const [, cookie] = capture(cookiesServiceMock.put).last();
          expect(cookie).toMatchInlineSnapshot(`"{\\"apiToken\\":\\"dummy\\",\\"type\\":\\"user\\"}"`);
          done();
        },
        fail,
        fail
      );
    });

    it('should save order token when order is available', done => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(new LoadOrderSuccess({ order: { id: '12345' } as Order }));

      restoreEffects.saveAPITokenToCookie$.subscribe(
        () => {
          verify(cookiesServiceMock.put('apiToken', anyString(), anything())).once();
          const [, cookie] = capture(cookiesServiceMock.put).last();
          expect(cookie).toMatchInlineSnapshot(
            `"{\\"apiToken\\":\\"dummy\\",\\"type\\":\\"order\\",\\"orderId\\":\\"12345\\"}"`
          );
          done();
        },
        fail,
        fail
      );
    });
  });

  describe('logOutUserIfTokenVanishes$', () => {
    it('should log out user when token is not available', done => {
      store$.dispatch(new LoginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

      restoreEffects.logOutUserIfTokenVanishes$.subscribe(
        action => {
          expect(action.type).toEqual(UserActionTypes.LogoutUser);
          done();
        },
        fail,
        fail
      );
    });
  });

  describe('removeAnonymousBasketIfTokenVanishes$', () => {
    it('should remove basket when token is not available', done => {
      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));

      restoreEffects.removeAnonymousBasketIfTokenVanishes$.subscribe({
        next: action => {
          expect(action.type).toEqual(BasketActionTypes.ResetBasket);
          done();
        },
        complete: fail,
      });
    });

    it('should do nothing when user is available', done => {
      store$.dispatch(new LoginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));
      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));

      restoreEffects.removeAnonymousBasketIfTokenVanishes$.subscribe(fail, fail, fail);

      // terminate checking
      setTimeout(done, 3000);
    });
  });

  describe('sessionKeepAlive$', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should occasionally refresh the basket if it is available', done => {
      restoreEffects.sessionKeepAlive$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Basket Internal] Load Basket`);
        done();
      });

      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE + 100);
    });

    it('should not refresh the basket if it is getting unavailable', done => {
      restoreEffects.sessionKeepAlive$.subscribe(fail);

      store$.dispatch(new LoadBasketSuccess({ basket: BasketMockData.getBasket() }));

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE / 2);

      store$.dispatch(new ResetBasket());

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE + 100);

      done();
    });

    it('should do nothing if basket is unavailable', done => {
      restoreEffects.sessionKeepAlive$.subscribe(fail);

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE + 100);

      done();
    });
  });
});
