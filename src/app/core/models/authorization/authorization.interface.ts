export interface AuthorizationData {
  userRoles: {
    roleDisplayName: string;
    permissions: { permissionID: string }[];
  }[];
}
