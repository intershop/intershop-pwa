import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { LogoutUser } from '../../../core/store/user/user.actions';
import { Address } from '../../../models/address/address.model';
import { AddressService } from '../../services/address/address.service';
import { checkoutReducers } from '../checkout.system';
import * as addressesActions from './addresses.actions';
import { AddressesEffects } from './addresses.effects';

describe('Addresses Effects', () => {
  let actions$: Observable<Action>;
  let addressServiceMock: AddressService;
  let effects: AddressesEffects;

  beforeEach(() => {
    addressServiceMock = mock(AddressService);

    when(addressServiceMock.getCustomerAddresses()).thenReturn(of([{ urn: 'test' } as Address]));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
      ],
      providers: [
        AddressesEffects,
        provideMockActions(() => actions$),
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.get(AddressesEffects);
  });

  describe('loadAddresses$', () => {
    it('should call the addressService for loadAddresses', done => {
      const action = new addressesActions.LoadAddresses();
      actions$ = of(action);

      effects.loadAddresses$.subscribe(() => {
        verify(addressServiceMock.getCustomerAddresses()).once();
        done();
      });
    });

    it('should map to action of type LoadAddressesSuccess', () => {
      const action = new addressesActions.LoadAddresses();
      const completion = new addressesActions.LoadAddressesSuccess([{ urn: 'test' } as Address]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAddresses$).toBeObservable(expected$);
    });
  });

  describe('resetAddressesAfterLogout$', () => {
    it('should map to action of type ResetAddresses if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new addressesActions.ResetAddresses();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetAddressesAfterLogout$).toBeObservable(expected$);
    });
  });
});
