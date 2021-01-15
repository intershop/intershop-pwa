import { TestBed } from '@angular/core/testing';

import { OrganizationGroupData } from './organization-group.interface';
import { OrganizationGroupMapper } from './organization-group.mapper';

describe('Organization Group Mapper', () => {
  let organizationGroupMapper: OrganizationGroupMapper;

  const ROOT: OrganizationGroupData = {
    attributes: { name: 'Some Name' },
    id: 'test',
    relationships: {},
  };

  const CHILD: OrganizationGroupData = {
    attributes: { name: 'Some Child' },
    id: 'Child',
    relationships: {
      parentNode: {
        data: { id: 'test' },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    organizationGroupMapper = TestBed.inject(OrganizationGroupMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => organizationGroupMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const mapped = organizationGroupMapper.fromData(ROOT);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).toHaveProperty('name', 'Some Name');
      expect(mapped).toHaveProperty('parentid', undefined);
    });

    it('should map incoming data to model data with parent reference', () => {
      const mapped = organizationGroupMapper.fromData(CHILD);
      expect(mapped).toHaveProperty('id', 'Child');
      expect(mapped).toHaveProperty('name', 'Some Child');
      expect(mapped).toHaveProperty('parentid', 'test');
    });

    it('should map customer name to mapped data', () => {
      const mapped = organizationGroupMapper.fromData(ROOT);
      const handled = organizationGroupMapper.handleRoot(mapped, 'OilCorp');
      expect(handled).toHaveProperty('id', 'test');
      expect(handled).toHaveProperty('name', 'OilCorp');
      expect(handled).toHaveProperty('parentid', undefined);
    });

    it('should NOT map customer name to mapped data', () => {
      const mapped = organizationGroupMapper.fromData(CHILD);
      const handled = organizationGroupMapper.handleRoot(mapped, 'OilCorp');
      expect(handled).toHaveProperty('id', 'Child');
      expect(handled).toHaveProperty('name', 'Some Child');
      expect(handled).toHaveProperty('parentid', 'test');
    });
  });
});
