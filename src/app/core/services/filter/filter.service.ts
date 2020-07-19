import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Link } from 'ish-core/models/link/link.model';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { SearchParameterMapper } from 'ish-core/models/search-parameter/search-parameter.mapper';
import { SearchParameter } from 'ish-core/models/search-parameter/search-parameter.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { getProductListingItemsPerPage } from 'ish-core/store/shopping/product-listing';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private itemsPerPage: number;

  constructor(
    private apiService: ApiService,
    private filterNavigationMapper: FilterNavigationMapper,
    private store: Store
  ) {
    this.store
      .pipe(select(getProductListingItemsPerPage))
      .subscribe(itemsPerPage => (this.itemsPerPage = itemsPerPage));
  }

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const categoryPath = categoryUniqueId.split('.').join('/');
    return this.applyFilterWithCategory('', categoryPath).pipe(
      map(filter => this.filterNavigationMapper.fromData(filter))
    );
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    const searchParameter = SearchParameterMapper.toData({ queryTerm: searchTerm } as SearchParameter);
    return this.apiService
      .get<FilterNavigationData>(`productfilters?${searchParameter}`, { skipApiErrorHandling: true })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    const params = formParamsToString({ ...searchParameter, category: undefined });
    const categoryPath = searchParameter.category ? searchParameter.category[0] : undefined;
    return (categoryPath
      ? this.applyFilterWithCategory(params, categoryPath)
      : this.applyFilterWithoutCategory(params)
    ).pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilteredProducts(
    searchParameter: URLFormParams,
    page: number = 1,
    sortKey?: string
  ): Observable<{ total: number; productSKUs: string[]; sortKeys: string[] }> {
    let params = new HttpParams()
      .set('amount', this.itemsPerPage.toString())
      .set('offset', ((page - 1) * this.itemsPerPage).toString())
      .set('attrs', ProductsService.STUB_ATTRS)
      .set('attributeGroup', AttributeGroupTypes.ProductLabelAttributes)
      .set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    const searchParameterString = formParamsToString({ ...searchParameter, category: undefined });
    const categoryPath = searchParameter.category ? searchParameter.category[0] : undefined;

    return (categoryPath
      ? this.getFilteredProductsWithCategory(searchParameterString, categoryPath, params)
      : this.getFilteredProductsWithoutCategory(searchParameterString, params)
    ).pipe(
      map((x: { total: number; elements: Link[]; sortKeys: string[] }) => ({
        productSKUs: x.elements.map(l => l.uri).map(ProductMapper.parseSKUfromURI),
        total: x.total,
        sortKeys: x.sortKeys,
      }))
    );
  }

  private getFilteredProductsWithoutCategory(searchParameter: string, params: HttpParams) {
    return this.apiService.get(`products${(searchParameter ? `?${searchParameter}&` : '?') + 'returnSortKeys=true'}`, {
      params,
    });
  }

  private getFilteredProductsWithCategory(searchParameter: string, category: string, params: HttpParams) {
    return this.apiService.get(
      `categories/${category}/products${(searchParameter ? `?${searchParameter}&` : '?') + 'returnSortKeys=true'}`,
      { params }
    );
  }

  private applyFilterWithoutCategory(searchParameter: string): Observable<FilterNavigationData> {
    const params = searchParameter ? `?${searchParameter}` : '';
    return this.apiService.get<FilterNavigationData>(`productfilters${params}`, {
      skipApiErrorHandling: true,
    });
  }

  private applyFilterWithCategory(searchParameter: string, category: string): Observable<FilterNavigationData> {
    const params = searchParameter ? `?${searchParameter}` : '';
    return this.apiService.get<FilterNavigationData>(`categories/${category}/productfilters${params}`, {
      skipApiErrorHandling: true,
    });
  }
}
