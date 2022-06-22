import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { WarrantyData } from 'ish-core/models/warranty/warranty.interface';
import { WarrantyMapper } from 'ish-core/models/warranty/warranty.mapper';
import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class WarrantyService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the the details of a warranty product.
   *
   * @param warrantySku   The sku of the warranty product.
   * @returns             The warranty.
   */
  getWarranty(warrantySku: string): Observable<Warranty> {
    return this.apiService
      .get<WarrantyData>(`products/${warrantySku}`, { sendSPGID: true })
      .pipe(map(warrantyData => WarrantyMapper.fromData(warrantyData)));
  }
}
