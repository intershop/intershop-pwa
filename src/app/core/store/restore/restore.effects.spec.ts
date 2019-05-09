import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers } from '@ngrx/store';
import { CookiesService } from '@ngx-utils/cookies';
import { cold } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { User } from 'ish-core/models/user/user.model';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { BasketActionTypes, LoadBasketSuccess } from '../checkout/basket';
import { checkoutReducers } from '../checkout/checkout-store.module';
import { coreReducers } from '../core-store.module';
import { shoppingReducers } from '../shopping/shopping-store.module';
import { LoginUserSuccess, LogoutUser, SetAPIToken, UserActionTypes, getLoggedInUser } from '../user';

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
        ...ngrxTesting({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
          checkout: combineReducers(checkoutReducers),
        }),
        RouterTestingModule.withRoutes([]),
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
      restoreEffects.restoreUserOrBasketByToken$.subscribe(fail, fail, done);
      router.initialNavigation();
    });

    it('should trigger action for loading basket if basket token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: 'dummy', type: 'basket' }));

      restoreEffects.restoreUserOrBasketByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', BasketActionTypes.LoadBasketByAPIToken);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        done();
      }, fail);
      router.initialNavigation();
    });

    it('should trigger action for loading user if user token could be retrieved', done => {
      when(cookiesServiceMock.get('apiToken')).thenReturn(JSON.stringify({ apiToken: 'dummy', type: 'user' }));

      restoreEffects.restoreUserOrBasketByToken$.subscribe(action => {
        expect(action).toHaveProperty('type', UserActionTypes.LoadUserByAPIToken);
        expect(action).toHaveProperty('payload.apiToken', 'dummy');
        done();
      }, fail);
      router.initialNavigation();
    });
  });

  describe('saveAPITokenToCookie$', () => {
    it('should not save token when neither basket nor user are available', () => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));

      expect(restoreEffects.saveAPITokenToCookie$).toBeObservable(cold('-'));
    });

    it('should save basket token when basket is available', done => {
      store$.dispatch(new SetAPIToken({ apiToken: 'dummy' }));
      store$.dispatch(new LoadBasketSuccess({ basket: { id: 'basket' } as Basket }));

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
      store$.dispatch(new LoadBasketSuccess({ basket: { id: 'basket' } as Basket }));
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
  });

  describe('logOutUserIfTokenVanishes$', () => {
    it('should log out user when token is not available', done => {
      store$.dispatch(new LoginUserSuccess({ user: { email: 'test@intershop.de' } as User, customer: undefined }));
      expect(getLoggedInUser(store$.state)).toBeTruthy();

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
});
