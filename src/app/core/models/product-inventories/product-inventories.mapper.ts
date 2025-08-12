import { Injectable } from '@angular/core';

import { ProductInventoryDetailsData } from './product-inventories.interface';
import { ProductInventoryDetails } from './product-inventories.model';

@Injectable({ providedIn: 'root' })
export class ProductInventoriesMapper {
  static fromData(data: ProductInventoryDetailsData): ProductInventoryDetails {
    if (!data) {
      return;
    }

    return {
      sku: data.sku,
      inStock: data.inStock,
      availableStock: data.stockLevel?.value ?? data.availableStock,
      availability: data.availability,
      availabilityMessage: data.availabilityMessage,
    };
  }
}
