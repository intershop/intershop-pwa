import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { ProductData } from '../../../models/product/product.interface';
import { ProductMapper } from '../../../models/product/product.mapper';
import { Product } from '../../../models/product/product.model';

/**
 * The Products Service handles the interaction with the 'products' REST API.
 */
@Injectable()
export class ProductsService {

  /**
   * The REST API URI endpoints
   */
  productsServiceIdentifier = 'products/';
  categoriesServiceIdentifier = 'categories/';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Get the full Product data for the given Product SKU.
   * @param sku  The Product SKU for the product of interest
   * @returns    The Product data
   */
  getProduct(sku: string): Observable<Product> {
    if (!sku) {
      return ErrorObservable.create('getProduct() called without a sku');
    }
    const params: HttpParams = new HttpParams().set('allImages', 'true');
    return this.apiService.get<ProductData>(this.productsServiceIdentifier + sku, params, null, false, false).pipe(
      map(productData => ProductMapper.fromData(productData))
    );
  }

  /**
   * Get a sorted list of all SKUs of Products belonging to a given Category.
   * @param categoryUniqueId  The unique Category ID
   * @param sortKey           The sortKey to sort the list, default value is ''
   * @returns                 List of Product SKUs, the unique Category ID and the possible sort keys as Observable
   */
  getProductsSkusForCategory(categoryUniqueId: string, sortKey = ''): Observable<{ skus: string[], categoryUniqueId: string, sortKeys: string[] }> {
    const path = this.categoriesServiceIdentifier + categoryUniqueId.replace(/\./g, '/') + '/' + this.productsServiceIdentifier;
    let params: HttpParams = new HttpParams().set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }
    return this.apiService.get<{ elements: { uri: string }[], sortKeys: string[], categoryUniqueId: string }>(path, params, null, false, false).pipe(
      map(response => ({
        skus: response.elements.map(el => el.uri.split('/').pop()),
        sortKeys: response.sortKeys,
        categoryUniqueId: categoryUniqueId
      }))
    );
  }

}
