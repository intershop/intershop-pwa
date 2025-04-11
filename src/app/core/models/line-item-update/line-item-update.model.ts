import { CustomFields } from 'ish-core/models/custom-field/custom-field.model';

export interface LineItemUpdate {
  itemId: string;
  quantity?: number;
  sku?: string;
  unit?: string;
  customFields?: CustomFields;
  warrantySku?: string;
}
