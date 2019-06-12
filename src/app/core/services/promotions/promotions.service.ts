import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class PromotionsService {
  constructor(private apiService: ApiService) {}

  /**
   * Get the full Promotion data for the given Promotion ID.
   * @param id  The Promotion ID for the promotion of interest.
   * @returns    The Promotion data.
   */
  getPromotion(id: string): Observable<Promotion> {
    if (!id) {
      return throwError('getPromotion() called without a id');
    }

    return this.apiService.get<Promotion>(`promotions/${id}`);
  }
}
