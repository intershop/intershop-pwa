import { UserRoleData } from './user-role.interface';
import { UserRoleMapper } from './user-role.mapper';

describe('User Role Mapper', () => {
  describe('fromData', () => {
    it(`should return User when getting  UserRoleData`, () => {
      const userRoleData = {
        fixed: true,
        permissions: [
          'Assign a cost object to a basket',
          'Assign a cost object to a basket line item',
          'Create Quotes',
          'Manage Purchases',
          'View cost objects',
        ],
        roleDisplayName: 'Buyer',
        roleID: 'APP_B2B_BUYER',
        type: 'UserRole',
      } as UserRoleData;
      const userRole = UserRoleMapper.fromData(userRoleData);

      expect(userRole).toBeTruthy();
      expect(userRole.fixed).toBe(userRoleData.fixed);
      expect(userRole.permissions).toBe(userRoleData.permissions);
      expect(userRole.roleDisplayName).toBe(userRoleData.roleDisplayName);
      expect(userRole.roleID).toBe(userRoleData.roleID);
    });
  });
});
