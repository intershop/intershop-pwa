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
            // tslint:disable-next-line: no-null-keyword
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
        Object {
          "application": Object {
            "applicationType": "intershop.B2CResponsive",
            "displayName": null,
            "urlIdentifier": "-",
          },
          "basket": Object {
            "acceleration": true,
          },
          "general": Object {
            "locales": Array [
              "en_US",
              "de_DE",
            ],
          },
          "services": Object {
            "captcha": Object {
              "siteKey": "ASDF",
            },
            "deeper": Object {
              "hidden": Object {
                "alt": 123,
                "foo": "bar",
                "num": 123,
              },
            },
            "gtm": Object {
              "monitor": true,
              "token": "QWERTY",
            },
          },
        }
      `);
    });

    it(`should return an empty object for falsy input`, () => {
      expect(ServerConfigMapper.fromData(undefined)).toMatchInlineSnapshot(`Object {}`);
      expect(ServerConfigMapper.fromData({} as ServerConfigData)).toMatchInlineSnapshot(`Object {}`);
    });
  });
});
