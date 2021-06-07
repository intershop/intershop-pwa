import { Group } from 'ish-core/models/group/group.model';

export interface OrderGroupPathBaseData {
  organizationId: string;
  groupPath: Group[];
  groupId: string;
  groupName: string;
}

export interface OrderGroupPathData {
  included?: {
    buyingContext: { [id: string]: OrderGroupPathBaseData };
  };
}
