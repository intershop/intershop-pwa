import { TestBed } from '@angular/core/testing';

import { RequisitionBaseData } from './requisition.interface';
import { RequisitionMapper } from './requisition.mapper';

describe('Requisition Mapper', () => {
  let requisitionMapper: RequisitionMapper;

  beforeEach(() => {
    requisitionMapper = TestBed.inject(RequisitionMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => requisitionMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        id: 'testUUDI',
        requisitionNo: '0001',
        orderNo: '10001',
        purchaseCurrency: 'USD',
        invoiceToAddress: 'urn_invoiceToAddress_123',
        commonShipToAddress: 'urn_commonShipToAddress_123',
        commonShippingMethod: 'shipping_method_123',
        customer: 'OilCorp',
        user: 'bboldner@test.intershop.de',
        costCenter: 'CostCenter123',
        creationDate: 12345678,
        lineItemCount: 2,
        approval: {
          costCenterApproval: {
            approvers: [{ email: 'jlink@test.intershop.de' }],
          },
          customerApproval: {
            approvers: [{ email: 'bboldner@test.intershop.de' }],
          },
        },
        approvalStatus: {
          statusCode: 'PENDING',
        },
        approvalStatuses: [
          {
            statusCode: 'APPROVED',
            approver: { firstName: 'Bernhard', lastName: 'Boldner', email: 'bboldner@test.intershop.de' },
            approvalDate: 76543627,
          },
        ],
        systemRejectErrors: [{ code: 'some.code', message: 'some message' }],
        systemRejected: true,
        userInformation: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        userBudgets: {
          budgetPeriod: 'weekly',
          orderSpentLimit: { currency: 'USD', value: 500, type: 'Money' },
          budget: { currency: 'USD', value: 3000, type: 'Money' },
        },
        totals: {},
        totalGross: { currency: 'USD', value: 2000 },
        totalNet: { currency: 'USD', value: 1890 },
      } as RequisitionBaseData;

      const mapped = requisitionMapper.fromData({ data });
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "approval": Object {
            "approvers": Array [
              Object {
                "email": "bboldner@test.intershop.de",
                "firstName": "Bernhard",
                "lastName": "Boldner",
              },
            ],
            "costCenterApproval": Object {
              "approvers": Array [
                Object {
                  "email": "jlink@test.intershop.de",
                },
              ],
              "statusCode": "PENDING",
            },
            "customerApproval": Object {
              "approvers": Array [
                Object {
                  "email": "bboldner@test.intershop.de",
                },
              ],
              "statusCode": "APPROVED",
            },
            "statusCode": "PENDING",
          },
          "attributes": undefined,
          "bucketId": undefined,
          "commonShipToAddress": undefined,
          "commonShippingMethod": undefined,
          "costCenter": "CostCenter123",
          "creationDate": 12345678,
          "customerNo": "OilCorp",
          "dynamicMessages": undefined,
          "email": "bboldner@test.intershop.de",
          "id": "testUUDI",
          "infos": undefined,
          "invoiceToAddress": undefined,
          "lineItemCount": 2,
          "lineItems": Array [],
          "orderNo": "10001",
          "payment": undefined,
          "promotionCodes": undefined,
          "purchaseCurrency": "USD",
          "requisitionNo": "0001",
          "systemRejectErrors": Array [
            "some message",
          ],
          "systemRejected": true,
          "taxationId": undefined,
          "totalProductQuantity": undefined,
          "totals": Object {
            "bucketSurchargeTotalsByType": undefined,
            "dutiesAndSurchargesTotal": undefined,
            "isEstimated": false,
            "itemRebatesTotal": undefined,
            "itemShippingRebatesTotal": undefined,
            "itemSurchargeTotalsByType": undefined,
            "itemTotal": undefined,
            "paymentCostsTotal": undefined,
            "shippingRebates": undefined,
            "shippingRebatesTotal": undefined,
            "shippingTotal": undefined,
            "taxTotal": undefined,
            "total": undefined,
            "undiscountedItemTotal": undefined,
            "undiscountedShippingTotal": undefined,
            "valueRebates": undefined,
            "valueRebatesTotal": undefined,
          },
          "user": Object {
            "email": "pmiller@test.intershop.de",
            "firstName": "Patricia",
            "lastName": "Miller",
          },
          "userBudget": Object {
            "budget": Object {
              "currency": "USD",
              "type": "Money",
              "value": 3000,
            },
            "budgetPeriod": "weekly",
            "orderSpentLimit": Object {
              "currency": "USD",
              "type": "Money",
              "value": 500,
            },
            "spentBudget": Object {
              "currency": "USD",
              "type": "Money",
              "value": 0,
            },
          },
        }
      `);
    });
  });
});
