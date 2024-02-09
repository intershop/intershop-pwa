import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash-es';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadServerConfigSuccess } from './server-config.actions';
import {
  getCustomFieldDefinition,
  getCustomFieldIdsForScope,
  getServerConfigParameter,
  isServerConfigurationLoaded,
} from './server-config.selectors';

describe('Server Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['serverConfig'])],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(isServerConfigurationLoaded(store$.state)).toBeFalsy();
      expect(getServerConfigParameter('application.applicationType')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('basket.acceleration')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('services.captcha.siteKey')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getServerConfigParameter('general.locales')(store$.state)).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('after setting serverConfig', () => {
    beforeEach(() => {
      store$.dispatch(
        loadServerConfigSuccess({
          config: {
            application: {
              applicationType: 'intershop.B2CResponsive',
              urlIdentifier: '-',
            },
            basket: {
              acceleration: true,
            },
            general: {
              locales: ['de_DE', 'en_US'],
            },
            services: {
              captcha: {
                siteKey: 'QWERTY',
              },
            },
          },
        })
      );
    });

    it('should set serverConfig to state', () => {
      expect(isServerConfigurationLoaded(store$.state)).toBeTruthy();
      expect(getServerConfigParameter('application.applicationType')(store$.state)).toMatchInlineSnapshot(
        `"intershop.B2CResponsive"`
      );
      expect(getServerConfigParameter('basket.acceleration')(store$.state)).toMatchInlineSnapshot(`true`);
      expect(getServerConfigParameter('services.captcha.siteKey')(store$.state)).toMatchInlineSnapshot(`"QWERTY"`);
      expect(getServerConfigParameter('general.locales')(store$.state)).toMatchInlineSnapshot(`
        [
          "de_DE",
          "en_US",
        ]
      `);
    });
  });

  describe('after setting config for custom fields', () => {
    beforeEach(() => {
      store$.dispatch(
        loadServerConfigSuccess({
          config: {},
          definitions: {
            entities: {
              commissionNumber: {
                name: 'commissionNumber',
                description: 'Commission Number',
                type: 'String',
                displayName: 'Commission Number',
              },
              projectNumber: {
                name: 'projectNumber',
                description: 'Project Number',
                type: 'String',
                displayName: 'Project Number',
              },
              customerProductId: {
                name: 'customerProductId',
                description: 'Customer Product ID',
                type: 'String',
                displayName: 'Customer Product ID',
              },
            },
            scopes: {
              Basket: [
                { name: 'commissionNumber', editable: true },
                { name: 'projectNumber', editable: true },
              ],
              Order: [
                { name: 'commissionNumber', editable: false },
                { name: 'projectNumber', editable: false },
              ],
              BasketLineItem: [{ name: 'customerProductId', editable: true }],
              OrderLineItem: [{ name: 'customerProductId', editable: false }],
            },
          },
        })
      );
    });

    it('should return custom field IDs definitions for scopes', () => {
      expect.addSnapshotSerializer({
        test: val =>
          !Array.isArray(val) &&
          isEqual(Object.keys(val), ['name', 'editable']) &&
          typeof val.name === 'string' &&
          typeof val.editable === 'boolean',
        print: (val: { name: string; editable: boolean }) =>
          `${val.name} (${val.editable ? 'editable' : 'not editable'})`,
      });

      expect(getCustomFieldIdsForScope('Basket')(store$.state)).toMatchInlineSnapshot(`
        [
          commissionNumber (editable),
          projectNumber (editable),
        ]
      `);
      expect(getCustomFieldIdsForScope('BasketLineItem')(store$.state)).toMatchInlineSnapshot(`
        [
          customerProductId (editable),
        ]
      `);
      expect(getCustomFieldIdsForScope('Order')(store$.state)).toMatchInlineSnapshot(`
        [
          commissionNumber (not editable),
          projectNumber (not editable),
        ]
      `);
      expect(getCustomFieldIdsForScope('OrderLineItem')(store$.state)).toMatchInlineSnapshot(`
        [
          customerProductId (not editable),
        ]
      `);
    });

    it('should return the field for an ID', () => {
      expect(getCustomFieldDefinition('commissionNumber')(store$.state)).toMatchInlineSnapshot(`
        {
          "description": "Commission Number",
          "displayName": "Commission Number",
          "name": "commissionNumber",
          "type": "String",
        }
      `);
      expect(getCustomFieldDefinition('customerProductId')(store$.state)).toMatchInlineSnapshot(`
        {
          "description": "Customer Product ID",
          "displayName": "Customer Product ID",
          "name": "customerProductId",
          "type": "String",
        }
      `);
      expect(getCustomFieldDefinition(undefined)(store$.state)).toBeUndefined();
    });
  });
});
