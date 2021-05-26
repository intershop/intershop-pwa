import { Group } from 'ish-core/models/group/group.model';

export interface BuyingContext {
  organizationId: string;
  groupPath: Group[];
  groupId: string;
  groupName: string;
}
