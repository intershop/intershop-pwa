import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { extractKeys } from 'ish-shared/formly/dev/testing/formly-testing-utils';

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

    it('should return right fields when calling getRegistrationConfig', () => {
      const fieldConfig = registrationConfigurationService.getRegistrationConfiguration();
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
      beforeEach(() => {
        const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: false };

        registrationConfigurationService.setConfiguration(registrationConfig);
      });

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getRegistrationConfiguration();
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
      beforeEach(() => {
        const registrationConfig: RegistrationConfigType = { businessCustomer: false, sso: false };

        registrationConfigurationService.setConfiguration(registrationConfig);
      });

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getRegistrationConfiguration();
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
