import { TestBed } from '@angular/core/testing';

import { RequisitionBaseData } from './requisition.interface';
import { RequisitionMapper } from './requisition.mapper';

describe('Requisition Mapper', () => {
  let requisitionMapper: RequisitionMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
        invoiceToAddress: 'urn_invoiceToAddress_123',
        commonShipToAddress: 'urn_commonShipToAddress_123',
        commonShippingMethod: 'shipping_method_123',
        customer: 'Heimroth',
        creationDate: 12345678,
        lineItemCount: 2,
        approvalStatus: { status: 'pending' },
        userInformation: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        totals: {},
        totalGross: { currency: 'USD', value: 2000 },
        totalNet: { currency: 'USD', value: 1890 },
      } as RequisitionBaseData;

      const mapped = requisitionMapper.fromData({ data });
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "approval": Object {
            "status": "pending",
          },
          "bucketId": undefined,
          "commonShipToAddress": undefined,
          "commonShippingMethod": undefined,
          "creationDate": 12345678,
          "customerNo": "Heimroth",
          "dynamicMessages": undefined,
          "id": "testUUDI",
          "infos": undefined,
          "invoiceToAddress": undefined,
          "lineItemCount": 2,
          "lineItems": Array [],
          "orderNo": undefined,
          "payment": undefined,
          "promotionCodes": undefined,
          "purchaseCurrency": undefined,
          "requisitionNo": "0001",
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
          "userBudgets": Object {
            "spentBudgetIncludingThisOrder": Object {
              "currency": undefined,
              "type": "Money",
              "value": undefined,
            },
          },
        }
      `);
    });
  });
});
