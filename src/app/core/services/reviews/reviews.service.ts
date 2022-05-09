import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ProductReviewData } from 'ish-core/models/product-reviews/product-reviews.interface';
import { ProductReviewsMapper } from 'ish-core/models/product-reviews/product-reviews.mapper';
import { ProductReviews } from 'ish-core/models/product-reviews/product-reviews.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), take(1));

  getProductReviews(sku: string): Observable<ProductReviews> {
    if (!sku) {
      return throwError(() => new Error('getProductReviews() called without sku'));
    }

    let params = new HttpParams();
    params.append('sku', sku);

    return this.currentCustomer$.pipe(
      tap(customer => {
        if (customer?.customerNo) {
          params = params.set('customerID', customer.customerNo);
        }
      }),
      switchMap(() =>
        this.apiService.get(`/products/${sku}/reviews`, { sendSPGID: true }).pipe(
          unpackEnvelope<Link>(),
          this.apiService.resolveLinks<ProductReviewData>(),
          map(reviews => ProductReviewsMapper.fromData(reviews, sku))
        )
      )
    );
  }
}
