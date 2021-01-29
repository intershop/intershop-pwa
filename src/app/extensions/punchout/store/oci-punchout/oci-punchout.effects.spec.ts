import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  addPunchoutUserSuccess,
  deletePunchoutUser,
  deletePunchoutUserFail,
  deletePunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
  startOCIPunchout,
  startOCIPunchoutFail,
  startOCIPunchoutSuccess,
} from './oci-punchout.actions';
import { OciPunchoutEffects } from './oci-punchout.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Oci Punchout Effects', () => {
  let actions$: Observable<Action>;
  let effects: OciPunchoutEffects;
  let punchoutService: PunchoutService;
  let store$: Store;

  const users = [{ id: 'ociUser', email: 'ociuser@test.de' }] as PunchoutUser[];

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getUsers()).thenReturn(of(users));
    when(punchoutService.createUser(users[0])).thenReturn(of(users[0]));
    when(punchoutService.deleteUser(users[0].login)).thenReturn(of(undefined));
    when(punchoutService.getOciPunchoutData(anyString())).thenReturn(of(undefined));
    when(punchoutService.submitOciPunchoutData(anyString(), anything())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('basket'),
        RouterTestingModule.withRoutes([{ path: 'account/punchout', component: DummyComponent }]),
      ],
      providers: [
        OciPunchoutEffects,
        provideMockActions(() => actions$),
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
      ],
    });

    effects = TestBed.inject(OciPunchoutEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadPunchoutUsers$', () => {
    it('should call the service for retrieving punchout users', done => {
      actions$ = of(loadPunchoutUsers());

      effects.loadPunchoutUsers$.subscribe(() => {
        verify(punchoutService.getUsers()).once();
        done();
      });
    });
    it('should map to action of type LoadPunchoutUsersSuccess', () => {
      const action = loadPunchoutUsers();
      const completion = loadPunchoutUsersSuccess({ users });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadPunchoutUsers$).toBeObservable(expected$);
    });

    it('should dispatch a loadPunchoutUsersFail action on failed users load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.getUsers()).thenReturn(throwError(error));

      const action = loadPunchoutUsers();
      const completion = loadPunchoutUsersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadPunchoutUsers$).toBeObservable(expected$);
    });
  });

  describe('createPunchoutUser$', () => {
    it('should call the service for adding a punchout user', done => {
      actions$ = of(addPunchoutUser({ user: users[0] }));

      effects.createPunchoutUser$.subscribe(() => {
        verify(punchoutService.createUser(anything())).once();
        done();
      });
    });
    it('should map to action of type AddPunchoutUserSuccess and DisplaySuccessMessage', () => {
      const action = addPunchoutUser({ user: users[0] });

      const completion1 = addPunchoutUserSuccess({ user: users[0] });
      const completion2 = displaySuccessMessage({
        message: 'account.punchout.connection.created.message',
        messageParams: { 0: `${users[0].login}` },
      });

      actions$ = hot('        -a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion1, d: completion2 });

      expect(effects.createPunchoutUser$).toBeObservable(expected$);
    });

    it('should dispatch a AddPunchoutUserFail action on failed user creation', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.createUser(users[0])).thenReturn(throwError(error));

      const action = addPunchoutUser({ user: users[0] });
      const completion = addPunchoutUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createPunchoutUser$).toBeObservable(expected$);
    });
  });

  describe('deletePunchoutUser$', () => {
    it('should call the service for deleting a punchout user', done => {
      actions$ = of(deletePunchoutUser({ login: users[0].login }));

      effects.deletePunchoutUser$.subscribe(() => {
        verify(punchoutService.deleteUser(users[0].login)).once();
        done();
      });
    });
    it('should map to action of type DeletePunchoutUserSuccess and DisplaySuccessMessage', () => {
      const action = deletePunchoutUser({ login: users[0].login });

      const completion1 = deletePunchoutUserSuccess({ login: users[0].login });
      const completion2 = displaySuccessMessage({
        message: 'account.punchout.connection.delete.confirmation',
        messageParams: { 0: `${users[0].login}` },
      });

      actions$ = hot('        -a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion1, d: completion2 });

      expect(effects.deletePunchoutUser$).toBeObservable(expected$);
    });

    it('should dispatch a DeletePunchoutUserFail action on failed user deletion', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.deleteUser(users[0].login)).thenReturn(throwError(error));

      const action = deletePunchoutUser({ login: users[0].login });
      const completion = deletePunchoutUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.deletePunchoutUser$).toBeObservable(expected$);
    });
  });

  describe('transferPunchoutBasket$', () => {
    beforeEach(() => {
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });
    it('should call the service for getting the punchout data', done => {
      actions$ = of(startOCIPunchout());

      effects.transferPunchoutBasket$.subscribe(() => {
        verify(punchoutService.getOciPunchoutData('BID')).once();
        done();
      });
    });

    it('should call the service for submitting the punchout data', done => {
      actions$ = of(startOCIPunchout());

      effects.transferPunchoutBasket$.subscribe(() => {
        verify(punchoutService.submitOciPunchoutData(anyString(), anything())).once();
        done();
      });
    });

    it('should map to action of type startOCIPunchoutSuccess', () => {
      const action = startOCIPunchout();

      const completion = startOCIPunchoutSuccess();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.transferPunchoutBasket$).toBeObservable(expected$);
    });

    it('should dispatch a DeletePunchoutUserFail action in case of an error', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.getOciPunchoutData(anyString())).thenReturn(throwError(error));

      const action = startOCIPunchout();
      const completion = startOCIPunchoutFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.transferPunchoutBasket$).toBeObservable(expected$);
    });

    it('should map to action of type DisplayErrorMessage in case of an error', () => {
      const error = makeHttpError({ status: 401, code: 'feld', message: 'e-message' });

      const action = startOCIPunchoutFail({ error });

      const completion = displayErrorMessage({
        message: 'e-message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.displayPunchoutErrorMessage$).toBeObservable(expected$);
    });
  });
});
