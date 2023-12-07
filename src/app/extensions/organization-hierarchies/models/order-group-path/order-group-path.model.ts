export interface OrderGroupPath {
  organizationId: string;
  groupPath: GroupPathEntry[];
  groupId: string;
  groupName: string;
  orderId?: string;
}

export interface GroupPathEntry {
  groupId: string;
  groupName: string;
}
