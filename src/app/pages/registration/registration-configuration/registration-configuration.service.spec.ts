import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { RegistrationConfigType, RegistrationConfigurationService } from './registration-configuration.service';

describe('Registration Configuration Service', () => {
  let registrationConfigurationService: RegistrationConfigurationService;
  let accountFacade: AccountFacade;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        RegistrationConfigurationService,
      ],
    });
    registrationConfigurationService = TestBed.inject(RegistrationConfigurationService);
  });

  describe('with sso', () => {
    beforeEach(() => {
      const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: true, userId: 'uid' };

      registrationConfigurationService.setConfiguration(registrationConfig);
    });
  });
  it('should return right fields when calling getRegistrationConfig', () => {
    const fieldConfig = registrationConfigurationService.getRegistrationConfiguration();
    expect(extractKeys(fieldConfig)).toMatchInlineSnapshot();
  });
});

type valueOrArray<T> = T | valueOrArray<T>[];

function extractKeys(fieldConfig: FormlyFieldConfig[]): valueOrArray<string> {
  return fieldConfig.map(field => (field.key as string) ?? extractKeys(field.fieldGroup));
}
