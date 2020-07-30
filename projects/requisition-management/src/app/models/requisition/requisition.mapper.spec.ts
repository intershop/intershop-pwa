import { TestBed } from '@angular/core/testing';

import { RequisitionData } from './requisition.interface';
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
      const data: RequisitionData = {
        id: 'testUUDI',
        requisitionNo: '0001',
        creationDate: 12345678,
        lineItemCount: 2,
        approvalStatus: { status: 'pending' },
        userInformation: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        totalGross: { currency: 'USD', value: 2000 },
        totalNet: { currency: 'USD', value: 1890 },
      };
      const mapped = requisitionMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "approval": Object {
            "status": "pending",
          },
          "creationDate": 12345678,
          "id": "testUUDI",
          "lineItemCount": 2,
          "orderNo": undefined,
          "requisitionNo": "0001",
          "totals": Object {
            "isEstimated": false,
            "itemTotal": undefined,
            "total": Object {
              "currency": "USD",
              "gross": 2000,
              "net": 1890,
              "type": "PriceItem",
            },
          },
          "user": Object {
            "email": "pmiller@test.intershop.de",
            "firstName": "Patricia",
            "lastName": "Miller",
          },
        }
      `);
    });
  });
});
