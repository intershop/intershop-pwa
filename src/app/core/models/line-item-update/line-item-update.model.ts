export interface LineItemUpdate {
  itemId: string;
  quantity?: number;
  sku?: string;
  unit?: string;
  partialOrderNo?: string;
  customerProductID?: string;
}
