import { LineItemData } from 'ish-core/models/line-item/line-item.interface';

export interface OrderItemData extends LineItemData {
  description: string;
  displayName: string;
  fulfillmentStatus: string;
}
