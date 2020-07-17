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
        user: 'test@user.com',
        approvalStatus: { status: 'pending' },
      };
      const mapped = requisitionMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'testUUDI');
      expect(mapped).toHaveProperty('requisitionNo', '0001');
      expect(mapped).toHaveProperty('user', 'test@user.com');
      expect(mapped).toHaveProperty('approvalStatus', 'pending');
    });
  });
});
