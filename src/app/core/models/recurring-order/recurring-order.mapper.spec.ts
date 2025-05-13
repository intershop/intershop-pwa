import { LineItemData } from 'ish-core/models/line-item/line-item.interface';

import { RecurringOrderData, RecurringOrderListData } from './recurring-order.interface';
import { RecurringOrderMapper } from './recurring-order.mapper';
import { RecurringOrder } from './recurring-order.model';

describe('Recurring Order Mapper', () => {
  const recurringOrderData = {
    number: '0000045',
    id: 'TEwK8ITr4AQAAAGRGCQADlo0',
    statusCode: 'APPROVED',
    expired: false,
    costCenterID: 'testCostCenterID',
    costCenterName: 'Test Cost Center Name',
    buyer: {
      companyName: 'Oil Corp',
    },
    startDate: '2024-01-26T09:52:16Z',
    endDate: '2024-01-26T09:52:16Z',
    repetitions: 3,
    interval: 'P1D',
    lineItems: [
      {
        calculated: false,
      } as LineItemData,
    ],
    approvalStatuses: [
      { approvalDate: 76543627, approver: { firstName: 'John', lastName: 'Doe' }, statusCode: 'APPROVED' },
    ],
    payments: [{ id: 'payment_1' }],
    paymentMethods: [{ displayName: 'payment_method_1' }],
    orderCount: 1,
    lastOrders: [{ id: 'order_1', documentNumber: '0000045', creationDate: '2024-01-26T09:52:16Z' }],
    totals: { itemTotal: { gross: { value: 100.0, currency: 'USD' }, net: { value: 100.0, currency: 'USD' } } },
  } as RecurringOrderData;

  const recurringOrderListData: RecurringOrderListData[] = [
    {
      active: true,
      buyer: {
        accountID: 'bboldner@test.intershop.de',
        companyName: 'Oil Corp',
        customerNo: 'OilCorp',
        email: 'bboldner@test.intershop.de',
        firstName: 'Bernhard',
        lastName: 'Boldner',
        userNo: 'bboldner',
      },
      creationDate: '2025-01-17T15:31:46Z',
      expired: false,
      id: 'wYmsEgAFLvQAAAGUJNYAD3Th',
      interval: 'P1D',
      itemCount: 1,
      lastOrderDate: '2025-01-17T15:52:05Z',
      nextOrderDate: '2025-01-18T15:52:05Z',
      number: '0000263',
      repetitions: 3,
      startDate: '2025-01-17T15:29:06Z',
      totalGross: {
        amount: 57.08,
        currency: 'USD',
      },
      totalNet: {
        amount: 47.97,
        currency: 'USD',
      },
    },
  ];

  describe('fromData', () => {
    let recurringOrder: RecurringOrder;

    it(`should return RecurringOrder when getting RecurringOrderData`, () => {
      recurringOrder = RecurringOrderMapper.fromData(recurringOrderData);
      expect(recurringOrder).toBeTruthy();
      expect(recurringOrder.documentNo).toEqual('0000045');
      expect(recurringOrder.id).toEqual('TEwK8ITr4AQAAAGRGCQADlo0');
      expect(recurringOrder.statusCode).toEqual('APPROVED');
      expect(recurringOrder.expired).toBeFalsy();
      expect(recurringOrder.costCenterId).toEqual('testCostCenterID');
      expect(recurringOrder.costCenterName).toEqual('Test Cost Center Name');
      expect(recurringOrder.user.companyName).toEqual('Oil Corp');
      expect(recurringOrder.recurrence).toEqual({
        startDate: '2024-01-26T09:52:16Z',
        endDate: '2024-01-26T09:52:16Z',
        repetitions: 3,
        interval: 'P1D',
      });
      expect(recurringOrder.lineItems).toBeTruthy();
      expect(recurringOrder.approvalStatuses).toEqual([
        {
          approvalDate: 76543627,
          approver: {
            firstName: 'John',
            lastName: 'Doe',
          },
          statusCode: 'APPROVED',
        },
      ]);
      expect(recurringOrder.payment).toMatchObject({
        displayName: 'payment_method_1',
        id: 'payment_1',
      });
      expect(recurringOrder.orderCount).toEqual(1);
      expect(recurringOrder.lastPlacedOrders).toEqual([
        { id: 'order_1', documentNumber: '0000045', creationDate: '2024-01-26T09:52:16Z' },
      ]);
      expect(recurringOrder.totals).toMatchObject({
        isEstimated: false,
        itemTotal: {
          currency: 'USD',
          gross: 100,
          net: 100,
          type: 'PriceItem',
        },
      });
    });
  });

  describe('fromListData', () => {
    it('should throw when input is falsy', () => {
      expect(() => RecurringOrderMapper.fromListData(undefined)).toThrow();
    });

    it(`should map incomming recurring order data to model data`, () => {
      const mapped = RecurringOrderMapper.fromListData(recurringOrderListData);
      expect(mapped).toMatchInlineSnapshot(`
        [
          {
            "active": true,
            "creationDate": "2025-01-17T15:31:46Z",
            "customerNo": "OilCorp",
            "documentNo": "0000263",
            "email": "bboldner@test.intershop.de",
            "expired": false,
            "id": "wYmsEgAFLvQAAAGUJNYAD3Th",
            "lastOrderDate": "2025-01-17T15:52:05Z",
            "nextOrderDate": "2025-01-18T15:52:05Z",
            "recurrence": {
              "endDate": undefined,
              "interval": "P1D",
              "repetitions": 3,
              "startDate": "2025-01-17T15:29:06Z",
            },
            "totals": {
              "isEstimated": false,
              "itemTotal": undefined,
              "total": {
                "currency": "USD",
                "gross": 57.08,
                "net": 47.97,
                "type": "PriceItem",
              },
            },
            "user": {
              "companyName": "Oil Corp",
              "email": "bboldner@test.intershop.de",
              "firstName": "Bernhard",
              "lastName": "Boldner",
            },
          },
        ]
      `);
    });
  });
});
