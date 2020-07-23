import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { UserData } from 'ish-core/models/user/user.interface';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { B2bUserData } from './b2b-user.interface';
import { B2bUserMapper } from './b2b-user.mapper';

describe('B2b User Mapper', () => {
  describe('fromData', () => {
    it(`should return User when getting UserData`, () => {
      const userData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
        preferredPaymentInstrument: { id: '1234' } as PaymentInstrument,
      } as UserData;
      const user = B2bUserMapper.fromData(userData);

      expect(user).toMatchInlineSnapshot(`
        Object {
          "birthday": undefined,
          "businessPartnerNo": undefined,
          "department": undefined,
          "email": undefined,
          "fax": undefined,
          "firstName": "Patricia",
          "lastName": "Miller",
          "login": undefined,
          "phoneBusiness": undefined,
          "phoneHome": undefined,
          "phoneMobile": undefined,
          "preferredInvoiceToAddressUrn": "urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:ilMKAE8BlIUAAAFgEdAd1LZU",
          "preferredLanguage": "en_US",
          "preferredPaymentInstrumentId": "1234",
          "preferredShipToAddressUrn": "urn:1234",
          "title": undefined,
        }
      `);
    });
  });

  describe('fromListData', () => {
    it(`should return User when getting UserListData`, () => {
      const userListData = [
        {
          name: 'Patricia Miller',
          login: 'pmiller@test.intershop.de',
          attributes: [
            {
              name: 'roles',
              value: ['APP_B2B_COSTCENTER_OWNER', 'APP_B2B_BUYER'],
            },
          ],
        } as B2bUserData,
      ];
      const users = B2bUserMapper.fromListData(userListData);

      expect(users).toMatchInlineSnapshot(`
        Array [
          Object {
            "login": "pmiller@test.intershop.de",
            "name": "Patricia Miller",
            "roleIDs": Array [
              "APP_B2B_COSTCENTER_OWNER",
              "APP_B2B_BUYER",
            ],
          },
        ]
      `);
    });
  });
});
