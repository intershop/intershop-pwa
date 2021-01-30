export interface Authorization {
  roles: {
    roleId: string;
    displayName: string;
  }[];
  permissionIDs: string[];
}
