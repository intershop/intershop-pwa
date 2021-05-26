import { Group } from 'ish-core/models/group/group.model';

export interface BuyingContextData {
  organizationId: string;
  groupPath: Group[];
  groupId: string;
  groupName: string;
}
