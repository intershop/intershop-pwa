import { TestBed } from '@angular/core/testing';

import { WarrantyData } from './warranty.interface';
import { WarrantyMapper } from './warranty.mapper';

describe('Warranty Mapper', () => {
  let warrantyMapper: WarrantyMapper;

  beforeEach(() => {
    warrantyMapper = TestBed.inject(WarrantyMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => warrantyMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: WarrantyData = {
        incomingField: 'test',
        otherField: false,
      };
      const mapped = warrantyMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
