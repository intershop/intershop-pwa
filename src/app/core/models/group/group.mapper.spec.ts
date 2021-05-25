import { TestBed } from '@angular/core/testing';

import { GroupData } from './group.interface';
import { GroupMapper } from './group.mapper';

describe('Group Mapper', () => {
  let groupMapper: GroupMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    groupMapper = TestBed.inject(GroupMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => groupMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: GroupData = {
        groupId: 'test',
        groupName: 'test',
      };
      const mapped = groupMapper.fromData(data);
      expect(mapped).toHaveProperty('groupId', 'test');
      expect(mapped).toHaveProperty('groupName', 'test');
    });
  });
});
