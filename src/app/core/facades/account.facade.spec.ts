import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { merge, noop, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, capture, spy, verify } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { User } from 'ish-core/models/user/user.model';
import { getAllAddresses } from 'ish-core/store/customer/addresses';
import { getLoggedInUser } from 'ish-core/store/customer/user';

import { AccountFacade } from './account.facade';

describe('Account Facade', () => {
  let store$: MockStore;
  let storeSpy$: MockStore;
  let facade: AccountFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store$ = TestBed.inject(MockStore);
    facade = TestBed.inject(AccountFacade);
    storeSpy$ = spy(store$);
  });

  describe('addresses$()', () => {
    describe('without user', () => {
      beforeEach(() => {
        store$.overrideSelector(getLoggedInUser, undefined);
        store$.overrideSelector(getAllAddresses, []);
      });

      it('should do nothing when no user is present', done => {
        facade.addresses$().subscribe(fail, fail, fail);

        setTimeout(() => {
          verify(storeSpy$.dispatch(anything())).never();
          done();
        }, 2000);
      });

      it('should do nothing when no user is present', fakeAsync(() => {
        facade.addresses$().subscribe(noop, fail, fail);

        tick(2000);

        verify(storeSpy$.dispatch(anything())).never();
      }));

      it('should load addresses when user is loaded delayed', done => {
        facade.user$ = merge(of(undefined), of({} as User).pipe(delay(30)));

        facade.addresses$().subscribe(noop, fail, fail);

        setTimeout(() => {
          verify(storeSpy$.dispatch(anything())).never();
        }, 20);

        setTimeout(() => {
          verify(storeSpy$.dispatch(anything())).once();
          done();
        }, 40);
      });
    });

    describe('with user', () => {
      beforeEach(() => {
        store$.overrideSelector(getLoggedInUser, {} as User);
        store$.overrideSelector(getAllAddresses, []);
      });

      it('should dispatch loading action and select addresses when user is present', done => {
        facade.addresses$().subscribe(data => {
          expect(data).toMatchInlineSnapshot(`Array []`);

          verify(storeSpy$.dispatch(anything())).once();

          expect(capture(storeSpy$.dispatch).last()).toMatchInlineSnapshot(`[Address Internal] Load Addresses`);

          done();
        });
      });
    });
  });

  describe('createCustomerAddress()', () => {
    it('should dispatch createCustomerAddress action on store', () => {
      facade.createCustomerAddress({ id: '123' } as Address);

      verify(storeSpy$.dispatch(anything())).once();
      expect(capture(storeSpy$.dispatch).last()).toMatchInlineSnapshot(`
        [Address] Create Customer Address:
          address: {"id":"123"}
      `);
    });
  });
});
