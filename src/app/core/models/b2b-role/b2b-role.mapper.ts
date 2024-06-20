import { Injectable } from '@angular/core';

import { B2bRoleData } from './b2b-role.interface';
import { B2bRole } from './b2b-role.model';

@Injectable({ providedIn: 'root' })
export class B2bRoleMapper {
  fromData(b2bRolesData: B2bRoleData[]): B2bRole[] {
    if (b2bRolesData) {
      return this.removeFixedFromOther(
        b2bRolesData.map(role => ({
          id: role.roleID,
          fixed: role.fixed,
          displayName: role.roleDisplayName,
          description: role.roleDescription,
          permissionDisplayNames: role.permissions.map(p => p.permissionDisplayName),
        }))
      );
    } else {
      throw new Error(`b2bRolesData is required`);
    }
  }

  private removeFixedFromOther(roles: B2bRole[]): B2bRole[] {
    const fixedPermission = roles
      .filter(r => r.fixed)
      .reduce((acc, role) => [...acc, ...role.permissionDisplayNames], []);
    return roles.map(role =>
      role.fixed
        ? role
        : { ...role, permissionDisplayNames: role.permissionDisplayNames.filter(p => !fixedPermission.includes(p)) }
    );
  }
}
