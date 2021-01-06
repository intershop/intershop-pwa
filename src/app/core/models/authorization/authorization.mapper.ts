import { Injectable } from '@angular/core';

import { AuthorizationData } from './authorization.interface';
import { Authorization } from './authorization.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationMapper {
  fromData(authorizationData: AuthorizationData): Authorization {
    if (authorizationData) {
      if (!authorizationData.userRoles?.length) {
        return { permissionIDs: [], roles: [] };
      }
      return {
        roles: authorizationData.userRoles.map(role => ({ displayName: role.roleDisplayName, roleId: role.roleID })),
        permissionIDs: authorizationData.userRoles
          .map(role => role.permissions.map(p => p.permissionID))
          .reduce((acc, val) => [...acc, ...val], [])
          .filter((v, i, a) => a.indexOf(v) === i),
      };
    } else {
      throw new Error(`authorization data is required`);
    }
  }
}
