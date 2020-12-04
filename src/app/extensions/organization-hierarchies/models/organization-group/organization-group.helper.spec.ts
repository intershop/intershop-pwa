import { OrganizationGroupHelper } from './organization-group.helper';
import { OrganizationGroup } from './organization-group.model';

describe('Organization Group Helper', () => {
  describe('equal', () => {
    it.each([
      [undefined, undefined, false],
      [{ id: 'test' } as OrganizationGroup, undefined, false],
      [undefined, { id: 'test' } as OrganizationGroup, false],
      [{ id: 'test' } as OrganizationGroup, { id: 'other' } as OrganizationGroup, false],
      [{ id: 'test' } as OrganizationGroup, { id: 'test' } as OrganizationGroup, true],
    ])(`should return %s when comparing %j and %j`, (o1, o2, expected) => {
      expect(OrganizationGroupHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
