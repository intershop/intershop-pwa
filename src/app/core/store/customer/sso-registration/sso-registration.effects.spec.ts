import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Address } from 'ish-core/models/address/address.model';
import { Customer, CustomerUserType, SsoRegistrationType } from 'ish-core/models/customer/customer.model';
import { UserService } from 'ish-core/services/user/user.service';

import { setRegistrationInfo } from './sso-registration.actions';
import { SsoRegistrationEffects } from './sso-registration.effects';

const mockRegistrationInfo: SsoRegistrationType = {
  companyInfo: {
    companyName1: 'companyname',
    taxationID: 'taxation',
  },
  address: {
    id: 'address',
  } as Address,
  userId: 'userid',
};

const mockCustomerUserType: CustomerUserType = {
  customer: { customerNo: 'CID', isBusinessCustomer: true } as Customer,
  userId: 'userId',
};

describe('Sso Registration Effects', () => {
  let effects: SsoRegistrationEffects;
  let actions$: Observable<Action>;
  const userServiceMock = mock(UserService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('businessCustomerRegistration')],
      providers: [
        SsoRegistrationEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useFactory: () => instance(userServiceMock) },
      ],
    });

    effects = TestBed.inject(SsoRegistrationEffects);
  });

  beforeEach(() => {
    when(userServiceMock.createUser(anything())).thenReturn(of(mockCustomerUserType));
  });
  it('should call userService when registrationInfo is set ', done => {
    const action = setRegistrationInfo(mockRegistrationInfo);
    actions$ = of(action);

    effects.registerUser$.subscribe(() => {
      verify(userServiceMock.createUser(anything())).once();
      done();
    });
  });
});
