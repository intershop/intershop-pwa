export interface AuthorizationData {
  userRoles: {
    roleDisplayName: string;
    roleID: string;
    permissions: { permissionID: string }[];
  }[];
}
