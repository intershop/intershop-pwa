import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { omit } from 'lodash-es';
import { Observable, identity } from 'rxjs';
import { map } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductDataStub } from 'ish-core/models/product/product.interface';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { getProductListingItemsPerPage } from 'ish-core/store/shopping/product-listing';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { URLFormParams, appendFormParamsToHttpParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private itemsPerPage: number;

  constructor(
    private apiService: ApiService,
    private filterNavigationMapper: FilterNavigationMapper,
    private productMapper: ProductMapper,
    private store: Store,
    private featureToggleService: FeatureToggleService
  ) {
    this.store
      .pipe(select(getProductListingItemsPerPage))
      .subscribe(itemsPerPage => (this.itemsPerPage = itemsPerPage));
  }

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const category = CategoryHelper.getCategoryPath(categoryUniqueId);
    return this.apiService
      .get<FilterNavigationData>(`categories/${category}/productfilters`)
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`productfilters`, { params: new HttpParams().set('searchTerm', searchTerm) })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilterForMaster(masterSKU: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`productfilters`, {
        params: new HttpParams().set('MasterSKU', masterSKU),
      })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    const params = appendFormParamsToHttpParams(omit(searchParameter, 'category'));

    const resource = searchParameter.category
      ? `categories/${searchParameter.category[0]}/productfilters`
      : 'productfilters';

    return this.apiService
      .get<FilterNavigationData>(resource, { params })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilteredProducts(
    searchParameter: URLFormParams,
    page: number = 1,
    sortKey?: string
  ): Observable<{ total: number; products: Partial<Product>[]; sortKeys: string[] }> {
    let params = new HttpParams()
      .set('amount', this.itemsPerPage.toString())
      .set('offset', ((page - 1) * this.itemsPerPage).toString())
      .set('attrs', ProductsService.STUB_ATTRS)
      .set('attributeGroup', AttributeGroupTypes.ProductLabelAttributes)
      .set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }
    params = appendFormParamsToHttpParams(omit(searchParameter, 'category'), params);

    const resource = searchParameter.category ? `categories/${searchParameter.category[0]}/products` : 'products';

    return this.apiService.get(resource, { params }).pipe(
      map((x: { total: number; elements: ProductDataStub[]; sortKeys: string[] }) => ({
        products: x.elements.map(stub => this.productMapper.fromStubData(stub)),
        total: x.total,
        sortKeys: x.sortKeys,
      })),
      params.has('MasterSKU')
        ? identity
        : map(({ products, sortKeys, total }) => ({ products: this.postProcessMasters(products), sortKeys, total }))
    );
  }

  /**
   * exchange single-return variation products to master products for B2B
   * TODO: this is a work-around
   */
  private postProcessMasters(products: Partial<Product>[]): Product[] {
    if (this.featureToggleService.enabled('advancedVariationHandling')) {
      return products.map(p =>
        ProductHelper.isVariationProduct(p) ? { sku: p.productMasterSKU, completenessLevel: 0 } : p
      ) as Product[];
    }
    return products as Product[];
  }
}
