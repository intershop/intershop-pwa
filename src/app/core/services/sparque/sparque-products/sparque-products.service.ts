import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, iif, map, of, switchMap, throwError } from 'rxjs';

import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueCountResponse, SparqueResponse } from 'ish-core/models/sparque/sparque.interface';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class SparqueProductsService extends ProductsService {
  private sparqueApiService = inject(SparqueApiService);

  searchProducts(
    searchTerm: string,
    amount: number,
    _sortKey?: string,
    offset?: number
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
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

  getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    _sortKey?: string,
    offset = 0
  ): Observable<{ total: number; products: Partial<Product>[]; sortableAttributes: SortableAttributesType[] }> {
    const searchterm = searchParameter.searchTerm ? searchParameter.searchTerm[0] : '';
    return this.searchProductKeys(searchterm, amount, offset, searchParameter).pipe(
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

  getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    _sortKey?: string,
    offset = 0
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!categoryUniqueId) {
      return throwError(() => new Error('getCategoryProducts() called without categoryUniqueId'));
    }

    return this.getCategoryProductKeys(categoryUniqueId, amount, offset).pipe(
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

  private getCategoryProductKeys(
    categoryUniqueId: string,
    amount: number,
    offset?: number
  ): Observable<{ skus: string[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    return this.sparqueApiService
      .get<[SparqueResponse, SparqueCountResponse]>(
        `e/categoryproducts/p/value/${
          categoryUniqueId.split('.')[categoryUniqueId.split('.').length - 1]
        }/results,count?count=${amount}&offset=${offset}`
      )
      .pipe(
        map(([result, count]) => ({
          skus: result?.items.map(item => item.tuple[0].attributes.sku),
          sortableAttributes: [],
          total: count.total,
        }))
      );
  }

  private searchProductKeys(
    searchTerm: string,
    amount: number,
    offset?: number,
    searchParameter?: URLFormParams
  ): Observable<{ skus: string[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    const appliedFilterPath = searchParameter ? SparqueApiService.getAppliedFilterPath(searchParameter) : '';

    // sortableAttributes and total are missing in REST response
    // request should wait some time to get recent basket --> could be optimized
    return this.sparqueApiService.getRelevantInformation$().pipe(
      switchMap(([basketSKUs, userId, locale]) =>
        this.sparqueApiService
          .get<[SparqueResponse, SparqueCountResponse]>(
            `${SparqueApiService.getSearchPath(
              searchTerm,
              locale,
              userId,
              basketSKUs
            )}${appliedFilterPath}/results,count?count=${amount}&offset=${offset}`
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
