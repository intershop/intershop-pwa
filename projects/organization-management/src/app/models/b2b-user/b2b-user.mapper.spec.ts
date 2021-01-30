import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { B2bUserData, B2bUserDataLink } from './b2b-user.interface';
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
        preferredLanguage: 'en_US',
        active: true,
      } as B2bUserData;
      const user = B2bUserMapper.fromData(userData);

      expect(user).toMatchInlineSnapshot(`
        Object {
          "active": true,
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
          login: 'pmiller@test.intershop.de',
          attributes: [
            {
              name: 'roleIDs',
              value: ['APP_B2B_COSTCENTER_OWNER', 'APP_B2B_BUYER'],
            },
            { name: 'firstName', value: 'Patricia' },
            { name: 'lastName', value: 'Miller' },
            { name: 'active', value: true },
            { name: 'budgetPeriod', type: 'String', value: 'monthly' },
            { name: 'orderSpentLimit', type: 'MoneyRO', value: { currency: 'USD', value: 500 } },
            { name: 'budget', type: 'MoneyRO', value: { currency: 'USD', value: 10000 } },
            { name: 'remainingBudget', type: 'MoneyRO', value: { currency: 'USD', value: 8000 } },
            { name: 'spentBudget', type: 'MoneyRO', value: { currency: 'USD', value: 2000 } },
          ],
        } as B2bUserDataLink,
      ];
      const users = B2bUserMapper.fromListData(userListData);

      expect(users).toMatchInlineSnapshot(`
        Array [
          Object {
            "active": true,
            "firstName": "Patricia",
            "lastName": "Miller",
            "login": "pmiller@test.intershop.de",
            "roleIDs": Array [
              "APP_B2B_COSTCENTER_OWNER",
              "APP_B2B_BUYER",
            ],
            "userBudget": Object {
              "budget": Object {
                "currency": "USD",
                "value": 10000,
              },
              "budgetPeriod": "monthly",
              "orderSpentLimit": Object {
                "currency": "USD",
                "value": 500,
              },
              "remainingBudget": Object {
                "currency": "USD",
                "value": 8000,
              },
              "spentBudget": Object {
                "currency": "USD",
                "value": 2000,
              },
            },
          },
        ]
      `);
    });
  });
});
