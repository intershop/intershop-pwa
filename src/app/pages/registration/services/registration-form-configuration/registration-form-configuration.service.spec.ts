import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, UrlSegment } from '@angular/router';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { extractKeys } from 'ish-shared/formly/dev/testing/formly-testing-utils';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';

import {
  RegistrationConfigType,
  RegistrationFormConfigurationService,
} from './registration-form-configuration.service';

describe('Registration Form Configuration Service', () => {
  let registrationConfigurationService: RegistrationFormConfigurationService;
  let accountFacade: AccountFacade;
  let fieldLibrary: FieldLibrary;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);
    fieldLibrary = mock(FieldLibrary);
    when(fieldLibrary.getConfigurationGroup('companyInfo')).thenReturn([
      {
        key: 'companyName1',
        props: {
          required: true,
        },
      },
      {
        key: 'companyName2',
      },
      {
        key: 'taxationID',
      },
    ]);
    when(fieldLibrary.getConfiguration('budgetPriceType')).thenReturn({
      key: 'budgetPriceType',
    });
    when(fieldLibrary.getConfigurationGroup('personalInfo')).thenReturn([
      {
        key: 'title',
      },
      {
        key: 'firstName',
      },
      {
        key: 'lastName',
      },
      {
        key: 'phoneHome',
      },
    ]);

    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: FieldLibrary, useFactory: () => instance(fieldLibrary) },
        RegistrationFormConfigurationService,
      ],
    });
    registrationConfigurationService = TestBed.inject(RegistrationFormConfigurationService);
  });

  describe('with sso', () => {
    const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: true, userId: 'uid' };

    it('should return right fields when calling getRegistrationConfig', () => {
      const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
      expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
        [
          [
            "companyName1",
            "companyName2",
            "taxationID",
          ],
          [
            "budgetPriceType",
          ],
          [
            "title",
            "firstName",
            "lastName",
            "phoneHome",
          ],
          [
            "termsAndConditions",
            "newsletterSubscription",
          ],
        ]
      `);
    });
  });

  describe('without sso', () => {
    describe('business customer', () => {
      const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: false };

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
        expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
          [
            [
              "login",
              "loginConfirmation",
              "password",
              "passwordConfirmation",
            ],
            [
              "companyName1",
              "companyName2",
              "taxationID",
            ],
            [
              "budgetPriceType",
            ],
            [
              "title",
              "firstName",
              "lastName",
              "phoneHome",
            ],
            [
              "termsAndConditions",
              "newsletterSubscription",
            ],
          ]
        `);
      });
    });
    describe('non-business customer', () => {
      const registrationConfig: RegistrationConfigType = { businessCustomer: false, sso: false };

      it('should return the right fields when calling getRegistrationConfig', () => {
        const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
        expect(extractKeys(fieldConfig)).toMatchInlineSnapshot(`
          [
            [
              "login",
              "loginConfirmation",
              "password",
              "passwordConfirmation",
            ],
            [
              "title",
              "firstName",
              "lastName",
              "phoneHome",
            ],
            [
              "termsAndConditions",
              "newsletterSubscription",
            ],
          ]
        `);
      });
    });
  });

  describe('extractConfig', () => {
    it('should set configuration parameters on init', () => {
      const snapshot = {
        queryParams: {},
        url: [{ path: '/register' } as UrlSegment],
      } as ActivatedRouteSnapshot;

      expect(registrationConfigurationService.extractConfig(snapshot)).toMatchInlineSnapshot(`
        {
          "businessCustomer": false,
          "cancelUrl": undefined,
          "sso": false,
          "userId": undefined,
        }
      `);
    });

    it('should set configuration parameters depending on router', () => {
      const snapshot = {
        queryParams: { userid: 'uid', cancelUrl: '/checkout' } as Params,
        url: [{ path: '/register' } as UrlSegment, { path: 'sso' } as UrlSegment],
      } as ActivatedRouteSnapshot;
      FeatureToggleModule.switchTestingFeatures('businessCustomerRegistration');

      expect(registrationConfigurationService.extractConfig(snapshot)).toMatchInlineSnapshot(`
        {
          "businessCustomer": true,
          "cancelUrl": "/checkout",
          "sso": true,
          "userId": "uid",
        }
      `);
    });
  });
});
