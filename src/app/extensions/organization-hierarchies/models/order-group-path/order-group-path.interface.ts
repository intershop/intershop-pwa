import { OrderGroupPathEntryData } from '../order-group-path-entry/order-group-path-entry.interface';

export interface OrderGroupPathBaseData {
  organizationId: string;
  groupPath: [OrderGroupPathEntryData];
  groupId: string;
  groupName: string;
}

export interface OrderGroupPathData {
  included?: {
    buyingContext: { [id: string]: OrderGroupPathBaseData };
  };
}
