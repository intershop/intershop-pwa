import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { ProductPriceDetailsData } from 'ish-core/models/product-prices/product-prices.interface';
import { ProductPricesMapper } from 'ish-core/models/product-prices/product-prices.mapper';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

@Injectable({ providedIn: 'root' })
export class PricesService {
  private priceHeaders = new HttpHeaders({
    Accept: 'application/vnd.intershop.pricing.v1+json',
  });

  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), take(1));

  getProductPrices(skus: string[]): Observable<ProductPriceDetails[]> {
    if (!skus || skus.length === 0) {
      return throwError(() => new Error('getProductPrices() called without skus'));
    }

    let params = new HttpParams();
    skus.map(sku => (params = params.append('sku', sku)));

    return this.currentCustomer$.pipe(
      tap(customer => {
        if (customer?.customerNo) {
          params = params.set('customerID', customer.customerNo);
        }
      }),
      switchMap(() =>
        this.apiService
          .get<{ data: ProductPriceDetailsData[] }>(`productprices`, { headers: this.priceHeaders, params })
          .pipe(map(element => element?.data?.map(prices => ProductPricesMapper.fromData(prices))))
      )
    );
  }
}
