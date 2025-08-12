export interface ProductInventoryDetails {
  sku: string;
  inStock: boolean;
  availableStock?: number;
  availability?: boolean;
  availabilityMessage?: string;
}
