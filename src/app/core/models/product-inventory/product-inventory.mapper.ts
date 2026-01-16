import { Injectable } from '@angular/core';

import { ProductInventoryData } from './product-inventory.interface';
import { ProductInventory } from './product-inventory.model';

@Injectable({ providedIn: 'root' })
export class ProductInventoryMapper {
  static fromData(data: ProductInventoryData): ProductInventory {
    if (!data) {
      return;
    }

    return {
      sku: data.sku,
      inStock: data.inStock,
      availableStock: data.availableStock,
    };
  }
}
