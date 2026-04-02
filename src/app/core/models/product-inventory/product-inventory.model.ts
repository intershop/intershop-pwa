export interface ProductInventory {
  sku: string;
  inStock: boolean;
  availableStock?: number;
  supplierStock?: SupplierStock[];
}

export interface SupplierStock {
  id: string; // supplier id
  displayName: string; // supplier display name
  inStock: boolean;
  availableStock?: number;
}
