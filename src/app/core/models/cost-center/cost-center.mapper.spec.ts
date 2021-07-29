import { TestBed } from '@angular/core/testing';

import { CostCenterData } from './cost-center.interface';
import { CostCenterMapper } from './cost-center.mapper';

describe('Cost Center Mapper', () => {
  let costCenterMapper: CostCenterMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    costCenterMapper = TestBed.inject(CostCenterMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => costCenterMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: CostCenterData = {
        incomingField: 'test',
        otherField: false,
      };
      const mapped = costCenterMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
