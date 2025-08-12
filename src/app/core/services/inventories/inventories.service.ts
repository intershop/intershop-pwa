import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductInventoryData } from 'ish-core/models/product-inventories/product-inventories.interface';
import { ProductInventoriesMapper } from 'ish-core/models/product-inventories/product-inventories.mapper';
import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class InventoriesService {
  private inventoryHeaders = new HttpHeaders({
    Accept: 'application/vnd.intershop.inventory.v1+json',
  });

  constructor(private apiService: ApiService) {}

  /**
   * Gets the inventory information for an array of products.
   *
   * @param skus           Array of product skus.
   * @returns              Product Inventory details.
   */
  getProductInventory(skus: string[]): Observable<ProductInventoryDetails[]> {
    if (!skus || skus.length === 0) {
      return throwError(() => new Error('getProductInventory() called without skus'));
    }

    let params = new HttpParams();
    skus.map(sku => (params = params.append('sku', sku)));

    return this.apiService
      .get<ProductInventoryData>(`inventories`, { headers: this.inventoryHeaders, params })
      .pipe(map(response => response?.data?.map(inventory => ProductInventoriesMapper.fromData(inventory))));
  }
}
