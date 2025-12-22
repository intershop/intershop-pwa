export interface ProductInventory {
  sku: string;
  inStock: boolean;
  availableStock?: number;
  availability?: boolean;
  availabilityMessage?: string;
}
