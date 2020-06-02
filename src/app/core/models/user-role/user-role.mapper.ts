import { UserRoleData } from './user-role.interface';
import { UserRole } from './user-role.model';

export class UserRoleMapper {
  static fromData(userRole: UserRoleData): UserRole {
    return userRole
      ? {
          ...userRole,
        }
      : undefined;
  }
}
