import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
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
      imports: [FeatureToggleModule.forTesting(), RouterTestingModule],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    });
    registrationConfigurationService = TestBed.inject(RegistrationFormConfigurationService);
  });

  describe('with sso', () => {
    const registrationConfig: RegistrationConfigType = { businessCustomer: true, sso: true, userId: 'uid' };

    it('should return right fields when calling getRegistrationConfig', () => {
      const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
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
        const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
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
        const fieldConfig = registrationConfigurationService.getFields(registrationConfig);
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

  describe('extractConfig', () => {
    it('should set configuration parameters on init', () => {
      const snapshot = {
        queryParams: {},
        url: [{ path: '/register' } as UrlSegment],
      } as ActivatedRouteSnapshot;

      expect(registrationConfigurationService.extractConfig(snapshot)).toMatchInlineSnapshot(`
        Object {
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
        Object {
          "businessCustomer": true,
          "cancelUrl": "/checkout",
          "sso": true,
          "userId": "uid",
        }
      `);
    });
  });
});
