import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, catchError, combineLatest, forkJoin, iif, map, of, switchMap, throwError } from 'rxjs';

import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { Product } from 'ish-core/models/product/product.model';
import {
  SparqueCountResponse,
  SparqueResponse,
  SparqueSearchWrapperResponse,
} from 'ish-core/models/sparque/sparque.interface';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueSortingMapper } from './sparque-sorting.mapper';

@Injectable({ providedIn: 'root' })
export class SparqueProductsService extends ProductsService {
  private sparqueApiService = inject(SparqueApiService);
  private store = inject(Store);

  searchProducts(
    searchTerm: string,
    amount: number,
    _sortKey?: string,
    offset?: number
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    console.log('searchProducts');
    const aaa$ = this.searchProductKeys(searchTerm, amount, offset);

    //aaa$.subscribe(a => console.log(a));
    const bbb$ = aaa$.pipe(
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
    bbb$.subscribe(b => console.log(b));
    return bbb$;
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
    sortKey?: string,
    offset = 0
  ): Observable<{ products: Product[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    if (!categoryUniqueId) {
      return throwError(() => new Error('getCategoryProducts() called without categoryUniqueId'));
    }

    //return
    return this.getCategoryProductKeys(categoryUniqueId, amount, sortKey, offset).pipe(
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
    sortKey?: string,
    offset?: number
  ): Observable<{ skus: string[]; sortableAttributes: SortableAttributesType[]; total: number }> {
    const sortingKey = sortKey ? `e/${sortKey}` : '';

    return combineLatest(
      this.sparqueApiService.get<[SparqueResponse, SparqueCountResponse]>(
        `e/categoryproducts/p/value/${
          categoryUniqueId.split('.')[categoryUniqueId.split('.').length - 1]
        }/${sortingKey}/results,count?count=${amount}&offset=${offset}`
      ),
      this.sparqueApiService.get<SparqueResponse>('e/sorting/results?config=default') //,
      //this.store.pipe(select(getCurrentLocale))
    ).pipe(
      map(results => ({
        skus: results[0][0].items.map(item => item.tuple[0].attributes.sku),
        sortableAttributes: SparqueSortingMapper.fromData(results[1], 'en-US'),
        total: results[0][1].total,
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

    //const search = searchParameter.searchTerm ? searchParameter.searchTerm[0] : '';
    // request should wait some time to get recent basket --> could be optimized
    console.log('searchTerm', searchTerm);
    return this.sparqueApiService.getRelevantInformation$().pipe(() =>
      this.sparqueApiService
        .get<SparqueSearchWrapperResponse>(
          `api/v2/search?Keyword=${searchTerm}&WorkspaceName=intershop-obi&ApiName=PWA&Locale=en-US&count=${amount}&offset=${offset}`
          /*`${SparqueApiService.getSearchPath(
              searchTerm,
              locale,
              userId,
              basketSKUs
            )}${appliedFilterPath}/results,count?count=${amount}&offset=${offset}`*/
        )
        //this.sparqueApiService.get<SparqueResponse>('e/sorting/results?config=default'),
        // this.store.pipe(select(getCurrentLocale))
        .pipe(
          map(results => ({
            skus: results.products.map(item => item.sku), //results...items.map(item => item.tuple[0].attributes.sku),
            sortableAttributes: [], //: SparqueSortingMapper.fromData(results[0][0], 'en-US'),
            total: results.total, //results[0][1].total,
          }))
        )
    );
  }
}
