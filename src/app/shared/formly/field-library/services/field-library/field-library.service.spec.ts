/* eslint-disable ish-custom-rules/ordered-imports */
import { TestBed } from '@angular/core/testing';

import {
  FIELD_LIBRARY_CONFIGURATION,
  FIELD_LIBRARY_CONFIGURATION_GROUP,
  FieldLibraryService,
} from './field-library.service';

describe('Reusable Formly Field Configurations Provider', () => {
  let reusableFormlyFieldConfigurationsProvider: FieldLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FieldLibraryService,
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'a',
            getFieldConfig: () => ({ type: 'a', templateOptions: { label: 'a' } }),
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'b',
            getFieldConfig: () => ({ type: 'b', templateOptions: { label: 'b' } }),
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'c',
            getFieldConfig: () => ({ type: 'c', wrappers: ['w1', 'w2'], templateOptions: { label: 'c' } }),
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION_GROUP,
          useValue: {
            id: 'ab',
            shortcutFor: ['a', 'b'],
          },
          multi: true,
        },
      ],
    });
    reusableFormlyFieldConfigurationsProvider = TestBed.inject(FieldLibraryService);
  });

  describe('single configuration', () => {
    it('should get configuration by id', () => {
      expect(reusableFormlyFieldConfigurationsProvider.getConfiguration('a')).toMatchInlineSnapshot(`
        Object {
          "key": "a",
          "templateOptions": Object {
            "label": "a",
          },
          "type": "a",
        }
      `);
    });

    it('should get configuration and override correctly', () => {
      expect(
        reusableFormlyFieldConfigurationsProvider.getConfiguration('a', {
          templateOptions: {
            label: 'new label',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "key": "a",
          "templateOptions": Object {
            "label": "new label",
          },
          "type": "a",
        }
      `);
    });

    it('should get configuration and override array correctly', () => {
      expect(
        reusableFormlyFieldConfigurationsProvider.getConfiguration('c', {
          wrappers: ['w2'],
        })
      ).toMatchInlineSnapshot(`
        Object {
          "key": "c",
          "templateOptions": Object {
            "label": "c",
          },
          "type": "c",
          "wrappers": Array [
            "w2",
          ],
        }
      `);
    });
  });

  describe('configuration group', () => {
    it('should get configuration group', () => {
      expect(reusableFormlyFieldConfigurationsProvider.getConfigurationGroup('ab')).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "a",
            "templateOptions": Object {
              "label": "a",
            },
            "type": "a",
          },
          Object {
            "key": "b",
            "templateOptions": Object {
              "label": "b",
            },
            "type": "b",
          },
        ]
      `);
    });

    it('should get configuration group and override correctly', () => {
      expect(
        reusableFormlyFieldConfigurationsProvider.getConfigurationGroup('ab', {
          a: {
            templateOptions: {
              label: 'new a label',
            },
          },

          b: {
            templateOptions: {
              label: 'new b label',
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "a",
            "templateOptions": Object {
              "label": "new a label",
            },
            "type": "a",
          },
          Object {
            "key": "b",
            "templateOptions": Object {
              "label": "new b label",
            },
            "type": "b",
          },
        ]
      `);
    });
  });

  describe('getAvailableConfigurationIds', () => {
    it('should get available ids', () => {
      expect(reusableFormlyFieldConfigurationsProvider.getAvailableConfigurationIds()).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          "c",
        ]
      `);
    });
  });
});
