import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { RegistrationConfigurationService } from './registration-configuration.service';

describe('Registration Configuration Service', () => {
  let registrationConfigurationService: RegistrationConfigurationService;
  let accountFacade: AccountFacade;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        RegistrationConfigurationService,
      ],
    });
    registrationConfigurationService = TestBed.inject(RegistrationConfigurationService);
  });

  it('should be created', () => {
    expect(registrationConfigurationService).toBeTruthy();
  });
});
