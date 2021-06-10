import { TestBed } from '@angular/core/testing';

import { OrderBaseData, OrderData } from 'ish-core/models/order/order.interface';

import { OrderGroupPathBaseData, OrderGroupPathData } from '../order-group-path/order-group-path.interface';

import { OrganizationOrderMapper } from './organization-order.mapper';

function getPayload(buyingContext?: string): OrderData & OrderGroupPathData {
  return {
    data: [
      {
        id: 'id',
        documentNumber: 'orderDocumentNo',
        creationDate: 0,
        status: 'New',
        statusCode: 'NEW',
        orderCreation: {
          status: 'COMPLETED',
        },
        basket: 'basketID',
        calculated: true,
        buyingContext: buyingContext ? buyingContext : 'BioTech_Austria@BioTech',
        totals: {
          grandTotal: undefined,
          itemTotal: undefined,
          undiscountedShippingTotal: undefined,
          valueDiscountsTotal: undefined,
        },
      },
    ],
    included: {
      buyingContext: {
        'BioTech_Austria@BioTech': {
          groupId: 'BioTech_Austria',
          groupName: 'BioTech Austria',
          organizationId: 'BioTech',
          groupPath: [{ groupId: 'BioTech_root', groupName: 'BioTech Root' }],
        },
      },
    },
  } as OrderData & OrderGroupPathData;
}

describe('Organization Order Mapper', () => {
  let organizationOrderMapper: OrganizationOrderMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    organizationOrderMapper = TestBed.inject(OrganizationOrderMapper);
  });

  describe('fromListData', () => {
    it('should throw when input is falsy', () => {
      expect(() => organizationOrderMapper.fromListData(undefined)).toThrow();
    });
    it('should resolve buyingContext include by orderGroupPathMapper when buyingContext matched with include id', () => {
      const payload = getPayload();
      const orderData = payload.data as OrderBaseData[];
      const orderGroupPathBaseData = payload.included.buyingContext[
        orderData[0].buyingContext
      ] as OrderGroupPathBaseData;
      const result = organizationOrderMapper.fromListData(payload);
      expect(result).toBeTruthy();
      expect(result.orders[0]).toHaveProperty('documentNo', orderData[0].documentNumber);
      expect(result.paths[0]).toHaveProperty('groupId', orderGroupPathBaseData.groupId);
    });
    it('should throw when buyingContext does not match with include id', () => {
      expect(() => organizationOrderMapper.fromListData(getPayload('test'))).toThrow();
    });
  });
});
