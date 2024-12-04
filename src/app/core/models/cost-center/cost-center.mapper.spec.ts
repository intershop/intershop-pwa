import { Link } from 'ish-core/models/link/link.model';

import { CostCenterData } from './cost-center.interface';
import { CostCenterMapper } from './cost-center.mapper';

describe('Cost Center Mapper', () => {
  describe('fromListData', () => {
    it(`should return costCenters when getting CostCenterLinks`, () => {
      const costCenterListData = [
        {
          attributes: [
            {
              name: 'name',
              value: 'Oil Corp Headquarter',
            },
            {
              name: 'costCenterId',
              value: '100400',
            },
            {
              name: 'budgetPeriod',
              value: 'monthly',
            },
            {
              name: 'active',
              value: true,
            },
            {
              name: 'budget',
              value: {
                type: 'Money',
                value: 20000.0,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
            {
              name: 'pendingOrders',
              value: 0,
            },
            {
              name: 'approvedOrders',
              value: 0,
            },
            {
              name: 'costCenterOwner',
              value: {
                email: 'jlink@test.intershop.de',
                firstName: 'Jack',
                lastName: 'Link',
                login: 'jlink@test.intershop.de',
              },
            },
            {
              name: 'spentBudget',
              value: {
                type: 'Money',
                value: 0.0,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
            {
              name: 'remainingBudget',
              value: {
                type: 'Money',
                value: 20000.0,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
          ],
          itemId: 'LmpA8AVnGzEAAAGRxuAADVoP',
        },
        {
          attributes: [
            {
              name: 'name',
              value: 'Oil Corp Subsidiary 1',
            },
            {
              name: 'costCenterId',
              value: '100401',
            },
            {
              name: 'budgetPeriod',
              value: 'monthly',
            },
            {
              name: 'active',
              value: true,
            },
            {
              name: 'budget',
              value: {
                type: 'Money',
                value: 5000.0,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
            {
              name: 'pendingOrders',
              value: 1,
            },
            {
              name: 'approvedOrders',
              value: 4,
            },
            {
              name: 'costCenterOwner',
              value: {
                email: 'bboldner@test.intershop.de',
                firstName: 'Bernhard',
                lastName: 'Boldner',
                login: 'bboldner@test.intershop.de',
              },
            },
            {
              name: 'spentBudget',
              value: {
                type: 'Money',
                value: 156759.02,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
            {
              name: 'remainingBudget',
              value: {
                type: 'Money',
                value: -151759.02,
                currencyMnemonic: 'USD',
                currency: 'USD',
              },
            },
          ],
          itemId: 'XopA8AVnEKUAAAGR0OAADVoP',
        },
      ] as Link[];
      const costCenters = CostCenterMapper.fromListData(costCenterListData);

      expect(costCenters).toBeTruthy();
      expect(costCenters).toMatchInlineSnapshot(`
        [
          {
            "active": true,
            "approvedOrders": 0,
            "budget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": 20000,
            },
            "budgetPeriod": "monthly",
            "costCenterId": "100400",
            "costCenterOwner": {
              "email": "jlink@test.intershop.de",
              "firstName": "Jack",
              "lastName": "Link",
              "login": "jlink@test.intershop.de",
            },
            "id": "LmpA8AVnGzEAAAGRxuAADVoP",
            "name": "Oil Corp Headquarter",
            "pendingOrders": 0,
            "remainingBudget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": 20000,
            },
            "spentBudget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": 0,
            },
          },
          {
            "active": true,
            "approvedOrders": 4,
            "budget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": 5000,
            },
            "budgetPeriod": "monthly",
            "costCenterId": "100401",
            "costCenterOwner": {
              "email": "bboldner@test.intershop.de",
              "firstName": "Bernhard",
              "lastName": "Boldner",
              "login": "bboldner@test.intershop.de",
            },
            "id": "XopA8AVnEKUAAAGR0OAADVoP",
            "name": "Oil Corp Subsidiary 1",
            "pendingOrders": 1,
            "remainingBudget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": -151759.02,
            },
            "spentBudget": {
              "currency": "USD",
              "currencyMnemonic": "USD",
              "type": "Money",
              "value": 156759.02,
            },
          },
        ]
      `);
    });
  });

  describe('fromData', () => {
    it(`should return a CostCenter when getting CostCenterData`, () => {
      const costCenterData = {
        costCenterId: '100400',
        orders: [
          {
            orderNo: '1',
            items: 2,
            orderDate: [2024, 1, 10],
            buyer: { attributes: [{ name: 'firstName', value: 'John' }] },
            orderTotalGross: { currency: 'USD', value: 1000.23 },
            orderTotalNet: { currency: 'USD', value: 800.87 },
          },
          {
            orderNo: '2',
            items: 4,
            orderDate: [2024, 1, 10],
            buyer: { attributes: [{ name: 'firstName', value: 'Jack' }] },
            orderTotalGross: { currency: 'USD', value: 1000.23 },
            orderTotalNet: { currency: 'USD', value: 800.87 },
          },
        ],
      } as CostCenterData;
      const costCenter = CostCenterMapper.fromData(costCenterData);

      expect(costCenter).toBeTruthy();
      expect(costCenter.costCenterId).toBe('100400');
      expect(costCenter.orders).toHaveLength(2);
      expect(costCenter.orders[0].user.firstName).toBe('John');
      expect(costCenter.orders[1].totals.total.gross).toBe(1000.23);
    });
  });
});
