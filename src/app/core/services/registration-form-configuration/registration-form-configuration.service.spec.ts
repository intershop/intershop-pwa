import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { extractKeys } from 'ish-shared/formly/dev/testing/formly-testing-utils';

import {
  RegistrationConfigType,
  RegistrationFormConfigurationService,
} from './registration-form-configuration.service';

describe('Registration Form Configuration Service', () => {
  let registrationConfigurationService: RegistrationFormConfigurationService;
  let accountFacade: AccountFacade;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    });
    registrationConfigurationService = TestBed.inject(RegistrationFormConfigurationService);
  });

  describe('with sso', () => {
    const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: true, userId: 'uid' };

    it('should return right fields when calling getRegistrationConfig', () => {
      const fieldConfig = registrationConfigurationService.getRegistrationFormConfiguration(registrationConfig);
      expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
        Array [
          Array [
            "companyName1",
            "companyName2",
            "taxationID",
          ],
          Array [
            "firstName",
            "lastName",
            "phoneHome",
          ],
          Array [
            "termsAndConditions",
          ],
        ]
      `);
    });
  });

  describe('without sso', () => {
    describe('business customer', () => {
      const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: false };

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getRegistrationFormConfiguration(registrationConfig);
        expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
          Array [
            Array [
              "login",
              "loginConfirmation",
              "password",
              "passwordConfirmation",
            ],
            Array [
              "companyName1",
              "companyName2",
              "taxationID",
            ],
            Array [
              "firstName",
              "lastName",
              "phoneHome",
            ],
            Array [
              "termsAndConditions",
            ],
          ]
        `);
      });
    });
    describe('non-business customer', () => {
      const registrationConfig: RegistrationConfigType = { businessCustomer: false, sso: false };

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getRegistrationFormConfiguration(registrationConfig);
        expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
          Array [
            Array [
              "login",
              "loginConfirmation",
              "password",
              "passwordConfirmation",
            ],
            Array [
              "firstName",
              "lastName",
              "phoneHome",
            ],
            Array [
              "termsAndConditions",
            ],
          ]
        `);
      });
    });
  });
});
