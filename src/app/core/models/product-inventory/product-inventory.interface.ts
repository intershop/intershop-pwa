export interface ProductInventoryData {
  sku: string;
  inStock: boolean;
  availableStock?: number;
  supplierStock?: SupplierStockData[];
}

interface SupplierStockData {
  id: string; // supplier id
  displayName: string; // supplier display name
  inStock: boolean;
  availableStock?: number;
}
