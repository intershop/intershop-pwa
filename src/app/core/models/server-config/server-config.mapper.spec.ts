import { ServerConfigData } from './server-config.interface';
import { ServerConfigMapper } from './server-config.mapper';

describe('Server Config Mapper', () => {
  describe('fromData', () => {
    it(`should return the ServerConfig when getting ServerConfigData`, () => {
      const config = ServerConfigMapper.fromData({
        data: {
          application: {
            applicationType: 'intershop.B2CResponsive',
            id: 'application',
            urlIdentifier: '-',
            // eslint-disable-next-line unicorn/no-null
            displayName: null,
          },
          basket: { acceleration: true, id: 'basket' },
          general: { id: 'general', locales: ['en_US', 'de_DE'] },
          services: {
            id: 'services',
            captcha: { id: 'captcha', siteKey: 'ASDF' },
            gtm: { id: 'gtm', token: 'QWERTY', monitor: 'true' },
            deeper: { id: 'deeper', hidden: { id: 'hidden', foo: 'bar', num: 123, alt: '123' } },
          },
        },
      });

      expect(config).toMatchInlineSnapshot(`
        [
          {
            "application": {
              "applicationType": "intershop.B2CResponsive",
              "displayName": null,
              "urlIdentifier": "-",
            },
            "basket": {
              "acceleration": true,
            },
            "general": {
              "locales": [
                "en_US",
                "de_DE",
              ],
            },
            "services": {
              "captcha": {
                "siteKey": "ASDF",
              },
              "deeper": {
                "hidden": {
                  "alt": 123,
                  "foo": "bar",
                  "num": 123,
                },
              },
              "gtm": {
                "monitor": true,
                "token": "QWERTY",
              },
            },
          },
          {
            "entities": {},
            "scopes": {},
          },
        ]
      `);
    });

    it(`should return an empty object for falsy input`, () => {
      expect(ServerConfigMapper.fromData(undefined)).toMatchInlineSnapshot(`
        [
          {},
          undefined,
        ]
      `);
      expect(ServerConfigMapper.fromData({} as ServerConfigData)).toMatchInlineSnapshot(`
        [
          {},
          undefined,
        ]
      `);
    });

    it('should map custom fields', () => {
      const config = ServerConfigMapper.fromData({
        data: {
          customFieldDefinitions: [
            {
              description: 'foo',
              displayName: 'foo',
              name: 'foo',
              position: 1,
              scopes: [
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'Basket',
                },
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'Order',
                },
              ],
              type: 'String',
            },
            {
              description: 'bar',
              displayName: 'bar',
              name: 'bar',
              position: 2,
              scopes: [
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'BasketLineItem',
                },
              ],
              type: 'String',
            },
            {
              description: 'baz',
              displayName: 'baz',
              name: 'baz',
              position: 3,
              scopes: [
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'Order',
                },
              ],
              type: 'String',
            },
            {
              description: 'qux',
              displayName: 'qux',
              name: 'qux',
              position: 4,
              scopes: [
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'BasketLineItem',
                },
                {
                  isEditable: false,
                  isVisible: false,
                  name: 'OrderLineItem',
                },
              ],
              type: 'String',
            },
            {
              description: 'wob',
              displayName: 'wob',
              name: 'wob',
              position: 2,
              scopes: [
                {
                  isEditable: true,
                  isVisible: true,
                  name: 'BasketLineItem',
                },
                {
                  isEditable: false,
                  isVisible: true,
                  name: 'OrderLineItem',
                },
              ],
              type: 'String',
            },
          ],
          general: {
            id: 'general',
            locales: ['en_US', 'de_DE'],
          },
        },
      });

      expect(config).toMatchInlineSnapshot(`
        [
          {
            "general": {
              "locales": [
                "en_US",
                "de_DE",
              ],
            },
          },
          {
            "entities": {
              "bar": {
                "description": "bar",
                "displayName": "bar",
                "name": "bar",
                "type": "String",
              },
              "baz": {
                "description": "baz",
                "displayName": "baz",
                "name": "baz",
                "type": "String",
              },
              "foo": {
                "description": "foo",
                "displayName": "foo",
                "name": "foo",
                "type": "String",
              },
              "qux": {
                "description": "qux",
                "displayName": "qux",
                "name": "qux",
                "type": "String",
              },
              "wob": {
                "description": "wob",
                "displayName": "wob",
                "name": "wob",
                "type": "String",
              },
            },
            "scopes": {
              "Basket": [
                {
                  "editable": true,
                  "name": "foo",
                },
              ],
              "BasketLineItem": [
                {
                  "editable": true,
                  "name": "bar",
                },
                {
                  "editable": true,
                  "name": "wob",
                },
                {
                  "editable": true,
                  "name": "qux",
                },
              ],
              "Order": [
                {
                  "editable": true,
                  "name": "foo",
                },
                {
                  "editable": true,
                  "name": "baz",
                },
              ],
              "OrderLineItem": [
                {
                  "editable": false,
                  "name": "wob",
                },
              ],
            },
          },
        ]
      `);
    });
  });
});
