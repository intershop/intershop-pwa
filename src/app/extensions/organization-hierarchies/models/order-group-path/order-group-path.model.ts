import { Group } from 'ish-core/models/group/group.model';

export interface OrderGroupPath {
  organizationId: string;
  groupPath: Group[];
  groupId: string;
  groupName: string;
  orderId: string;
}
