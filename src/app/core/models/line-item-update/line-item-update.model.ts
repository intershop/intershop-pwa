export interface LineItemUpdate {
  itemId: string;
  quantity?: number;
  sku?: string;
  unit?: string;
  customerProductID?: string;
  partialOrderNo?: string;
}
