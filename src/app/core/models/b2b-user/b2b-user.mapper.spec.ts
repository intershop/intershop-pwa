import { B2bUserDataLink } from './b2b-user.interface';
import { B2bUserMapper } from './b2b-user.mapper';

describe('B2b User Mapper', () => {
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
        [
          {
            "active": true,
            "businessPartnerNo": undefined,
            "firstName": "Patricia",
            "lastName": "Miller",
            "login": "pmiller@test.intershop.de",
            "roleIDs": [
              "APP_B2B_COSTCENTER_OWNER",
              "APP_B2B_BUYER",
            ],
          },
        ]
      `);
    });
  });
});
