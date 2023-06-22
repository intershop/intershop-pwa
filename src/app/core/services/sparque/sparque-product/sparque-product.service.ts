import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, iif, map, of, switchMap, throwError } from 'rxjs';

import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueCountResponse, SparqueFacetOptionsResponse } from 'ish-core/models/sparque/sparque.interface';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';

@Injectable({ providedIn: 'root' })
export class SparqueProductService extends ProductsService {
  private sparqueApiService = inject(SparqueApiService);

  searchProducts(
    searchTerm: string,
    amount: number,
    _sortKey?: string,
    offset?: number
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    // TODO Sparque API should provide all necessary product information
    return this.searchProductKeys(searchTerm, amount, offset).pipe(
      switchMap(({ skus, sortableAttributes, total }) =>
        iif(
          () => !!total,
          forkJoin(skus.map(sku => this.getProduct(sku).pipe(catchError(() => of(undefined))))),
          of([])
        ).pipe(
          map(products => ({
            products: products.filter(p => !!p),
            sortableAttributes,
            total,
          }))
        )
      )
    );
  }

  private searchProductKeys(
    searchTerm: string,
    amount: number,
    offset?: number
  ): Observable<{ skus: string[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!searchTerm) {
      return throwError(() => new Error('searchProducts() called without searchTerm'));
    }

    // sortableAttributes and total are missing in REST response
    // request should wait some time to get recent basket --> could be optimized
    return this.sparqueApiService.getRelevantInformation$().pipe(
      switchMap(([basketSKUs, userId, locale]) =>
        this.sparqueApiService
          .get<[SparqueFacetOptionsResponse, SparqueCountResponse]>(
            `${SparqueApiService.getSearchPath(
              searchTerm,
              locale,
              userId,
              basketSKUs
            )}/results,count?config=default&count=${amount}&offset=${offset}`
          )
          .pipe(
            map(([result, count]) => ({
              skus: result?.items.map(item => item.tuple[0].attributes.sku),
              sortableAttributes: [],
              total: count.total,
            }))
          )
      )
    );
  }
}
