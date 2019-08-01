import { LineItemData } from '../line-item/line-item.interface';
export interface OrderItemData extends LineItemData {
  description: string;
  displayName: string;
  fulfillmentStatus: string;
}
