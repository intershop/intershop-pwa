import { GroupHelper } from './group.helper';
import { Group } from './group.model';

describe('Group Helper', () => {
  describe('empty()', () => {
    it('should create an empty group tree instance when called', () => {
      const empty = GroupHelper.empty();
      expect(empty).toBeTruthy();
      expect(empty.rootIds).toBeEmpty();
      expect(empty.groups).toBeEmpty();
      expect(empty.edges).toBeEmpty();
    });
    it('should raise an error when called with falsy input', () => {
      expect(() => GroupHelper.merge(undefined, GroupHelper.empty())).toThrowError();
    });
    it('should merge groups with mutual exclusive properties to a single group', () => {
      const groupA = {
        id: 'A',
        name: undefined,
        organization: 'Some-Org',
      } as Group;
      const groupB = {
        id: 'A',
        name: 'Cool Group',
        organization: undefined,
      } as Group;
      const merged = GroupHelper.mergeGroup(groupA, groupB);
      expect(merged).toHaveProperty('id', 'A');
      expect(merged).toHaveProperty('name', 'Cool Group');
      expect(merged).toHaveProperty('organization', 'Some-Org');
    });
  });
});
