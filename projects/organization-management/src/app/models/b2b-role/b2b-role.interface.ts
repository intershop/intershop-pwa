export interface B2bRoleData {
  roleID: string;
  fixed: boolean;
  roleDisplayName: string;
  roleDescription?: string;
  permissions: { permissionDisplayName: string }[];
}
