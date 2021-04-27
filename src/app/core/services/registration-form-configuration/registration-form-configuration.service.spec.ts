import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { extractKeys } from 'ish-shared/formly/dev/testing/formly-testing-utils';

import {
  RegistrationConfigType,
  RegistrationFormConfigurationService,
} from './registration-form-configuration.service';

describe('Registration Form Configuration Service', () => {
  let registrationConfigurationService: RegistrationFormConfigurationService;
  let accountFacade: AccountFacade;
  let featureToggleService: FeatureToggleService;

  beforeEach(() => {
    accountFacade = mock(AccountFacade);
    featureToggleService = mock(FeatureToggleService);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
      ],
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
      when(featureToggleService.enabled(anyString())).thenReturn(false);

      expect(registrationConfigurationService.extractConfig(snapshot)).toMatchInlineSnapshot(`
        Object {
          "businessCustomer": false,
          "sso": false,
          "userId": undefined,
        }
      `);
    });

    it('should set configuration parameters depending on router', () => {
      const snapshot = {
        queryParams: { userid: 'uid' } as Params,
        url: [{ path: '/register' } as UrlSegment, { path: 'sso' } as UrlSegment],
      } as ActivatedRouteSnapshot;
      when(featureToggleService.enabled(anyString())).thenReturn(true);

      expect(registrationConfigurationService.extractConfig(snapshot)).toMatchInlineSnapshot(`
        Object {
          "businessCustomer": true,
          "sso": true,
          "userId": "uid",
        }
      `);
    });
  });
});
