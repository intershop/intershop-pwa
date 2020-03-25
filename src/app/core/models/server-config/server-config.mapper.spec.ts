import { ServerConfigData } from './server-config.interface';
import { ServerConfigMapper } from './server-config.mapper';

describe('Server Config Mapper', () => {
  describe('fromData', () => {
    it(`should return the ServerConfig when getting ServerConfigData`, () => {
      const config = ServerConfigMapper.fromData({
        data: [
          { applicationType: 'intershop.B2CResponsive', id: 'application', urlIdentifier: '-' },
          { acceleration: true, id: 'basket' },
          { id: 'general', locales: ['en_US', 'de_DE'] },
          {
            id: 'services',
            elements: [
              { id: 'captcha', siteKey: 'ASDF' },
              { id: 'gtm', token: 'QWERTY', monitor: true },
              { id: 'deeper', elements: [{ id: 'hidden', foo: 'bar' }] },
            ],
          },
        ],
      });

      expect(config).toMatchInlineSnapshot(`
        Object {
          "application": Object {
            "applicationType": "intershop.B2CResponsive",
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
                "foo": "bar",
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
