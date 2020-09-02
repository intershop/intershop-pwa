import { TestBed } from '@angular/core/testing';

import { OrganizationGroupData } from './organization-group.interface';
import { OrganizationGroupMapper } from './organization-group.mapper';

describe('Organization Group Mapper', () => {
  let organizationGroupMapper: OrganizationGroupMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    organizationGroupMapper = TestBed.inject(OrganizationGroupMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => organizationGroupMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: OrganizationGroupData = {
        incomingField: 'test',
        otherField: 'other',
      };
      const mapped = organizationGroupMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('name', 'other');
    });
  });
});
