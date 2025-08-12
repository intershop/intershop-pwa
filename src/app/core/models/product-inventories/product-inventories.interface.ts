export interface ProductInventoryDetailsData {
  sku: string;
  inStock: boolean;
  availableStock?: number;
  availability?: boolean;
  availabilityMessage?: string;
  stockLevel?: {
    value: number;
    unit?: string;
  };
  stockLevelCode?: string;
}

export interface ProductInventoryData {
  data: ProductInventoryDetailsData[];
}
