import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadBasketByAPIToken, loadBasketSuccess } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadOrderByAPIToken, loadOrderSuccess } from 'ish-core/store/customer/orders';
import { loadUserByAPIToken, loginUserSuccess, logoutUser, setAPIToken } from 'ish-core/store/customer/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { RestoreEffects } from './restore.effects';

describe('Restore Effects', () => {
  let restoreEffects: RestoreEffects;
  let router: Router;
  let cookiesServiceMock: CookiesService;
  let store$: Store;

  beforeEach(() => {
    cookiesServiceMock = mock(CookiesService);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router'], true),
        CustomerStoreModule.forTesting('user', 'orders', 'basket'),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [RestoreEffects, { provide: CookiesService, useFactory: () => instance(cookiesServiceMock) }],
    });

    restoreEffects = TestBed.inject(RestoreEffects);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(restoreEffects).toBeTruthy();
  });

  describe('destroyTokenInCookieOnLogout$', () => {
    it('should destroy the cookie when user logs out', done => {
      restoreEffects.destroyTokenInCookieOnLogout$.subscribe(() => {
        verify(cookiesServiceMock.remove('apiToken')).once();
        done();
      }, fail);

      store$.dispatch(logoutUser());
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
        expect(action).toHaveProperty('type', loadBasketByAPIToken.type);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        done();
      }, fail);
      router.initialNavigation();
    });

    it('should trigger action for loading user if user token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: 'dummy', type: 'user' }));

      restoreEffects.restoreUserOrBasketOrOrderByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', loadUserByAPIToken.type);
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
        expect(action).toHaveProperty('type', loadOrderByAPIToken.type);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        expect(action).toHaveProperty('payload.orderId', '12345');
        done();
      }, fail);
      router.initialNavigation();
    });
  });

  describe('saveAPITokenToCookie$', () => {
    it('should not save token when neither basket nor user nor order is available', () => {
      store$.dispatch(setAPIToken({ apiToken: 'dummy' }));

      expect(restoreEffects.saveAPITokenToCookie$).toBeObservable(cold('-'));
    });

    it('should save basket token when basket is available', done => {
      store$.dispatch(setAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));

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
      store$.dispatch(setAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(loginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

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
      store$.dispatch(setAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));
      store$.dispatch(loginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

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
      store$.dispatch(setAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(loadOrderSuccess({ order: { id: '12345' } as Order }));

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
      store$.dispatch(loginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));

      restoreEffects.logOutUserIfTokenVanishes$.subscribe(
        action => {
          expect(action.type).toEqual(logoutUser.type);
          done();
        },
        fail,
        fail
      );
    });
  });

  describe('removeAnonymousBasketIfTokenVanishes$', () => {
    it('should remove basket when token is not available', done => {
      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));

      restoreEffects.removeAnonymousBasketIfTokenVanishes$.subscribe({
        next: action => {
          expect(action.type).toEqual(logoutUser.type);
          done();
        },
        complete: fail,
      });
    });

    it('should do nothing when user is available', done => {
      store$.dispatch(loginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));
      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));

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

      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE + 100);
    });

    it('should not refresh the basket if it is getting unavailable', done => {
      restoreEffects.sessionKeepAlive$.subscribe(fail);

      store$.dispatch(loadBasketSuccess({ basket: BasketMockData.getBasket() }));

      jest.advanceTimersByTime(RestoreEffects.SESSION_KEEP_ALIVE / 2);

      store$.dispatch(logoutUser());

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
