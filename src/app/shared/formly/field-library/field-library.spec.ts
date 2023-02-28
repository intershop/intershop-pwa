/* eslint-disable ish-custom-rules/ordered-imports */
import { TestBed } from '@angular/core/testing';

import { FIELD_LIBRARY_CONFIGURATION, FIELD_LIBRARY_CONFIGURATION_GROUP, FieldLibrary } from './field-library';

describe('Field Library', () => {
  let fieldLibrary: FieldLibrary;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FIELD_LIBRARY_CONFIGURATION_GROUP,
          useValue: {
            id: 'ab',
            shortcutFor: ['a', 'b'],
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'a',
            getFieldConfig: () => ({ type: 'a', props: { label: 'a' } }),
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'b',
            getFieldConfig: () => ({ type: 'b', props: { label: 'b' } }),
          },
          multi: true,
        },
        {
          provide: FIELD_LIBRARY_CONFIGURATION,
          useValue: {
            id: 'c',
            getFieldConfig: () => ({ type: 'c', wrappers: ['w1', 'w2'], props: { label: 'c' } }),
          },
          multi: true,
        },
        FieldLibrary,
      ],
    });
    fieldLibrary = TestBed.inject(FieldLibrary);
  });

  describe('single configuration', () => {
    it('should get configuration by id', () => {
      expect(fieldLibrary.getConfiguration('a')).toMatchInlineSnapshot(`
        {
          "key": "a",
          "props": {
            "label": "a",
          },
          "type": "a",
        }
      `);
    });

    it('should get configuration and override correctly', () => {
      expect(
        fieldLibrary.getConfiguration('a', {
          props: {
            label: 'new label',
          },
        })
      ).toMatchInlineSnapshot(`
        {
          "key": "a",
          "props": {
            "label": "new label",
          },
          "type": "a",
        }
      `);
    });

    it('should get configuration and override array correctly', () => {
      expect(
        fieldLibrary.getConfiguration('c', {
          wrappers: ['w2'],
        })
      ).toMatchInlineSnapshot(`
        {
          "key": "c",
          "props": {
            "label": "c",
          },
          "type": "c",
          "wrappers": [
            "w2",
          ],
        }
      `);
    });
  });

  describe('configuration group', () => {
    it('should get configuration group', () => {
      expect(fieldLibrary.getConfigurationGroup('ab')).toMatchInlineSnapshot(`
        [
          {
            "key": "a",
            "props": {
              "label": "a",
            },
            "type": "a",
          },
          {
            "key": "b",
            "props": {
              "label": "b",
            },
            "type": "b",
          },
        ]
      `);
    });

    it('should get configuration group and override correctly', () => {
      expect(
        fieldLibrary.getConfigurationGroup('ab', {
          a: {
            props: {
              label: 'new a label',
            },
          },

          b: {
            props: {
              label: 'new b label',
            },
          },
        })
      ).toMatchInlineSnapshot(`
        [
          {
            "key": "a",
            "props": {
              "label": "new a label",
            },
            "type": "a",
          },
          {
            "key": "b",
            "props": {
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
      expect(fieldLibrary.getAvailableConfigurationIds()).toMatchInlineSnapshot(`
        [
          "a",
          "b",
          "c",
        ]
      `);
    });
  });
});
