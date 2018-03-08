import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { ProductFactory } from '../../../models/product/product.factory';
import { ProductData } from '../../../models/product/product.interface';
import { Product } from '../../../models/product/product.model';

@Injectable()
export class ProductsService {

  private serviceIdentifier = 'products';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * REST API - Get full product data
   * @param productSku  The product SKU for the product of interest.
   * @returns           Product information.
   */
  getProduct(productSku: string): Observable<Product> {
    if (!productSku) {
      return ErrorObservable.create('getProduct() called without a productSku');
    }
    const params: HttpParams = new HttpParams().set('allImages', 'true');
    return this.apiService.get<ProductData>(this.serviceIdentifier + '/' + productSku, params, null, false, false).pipe(
      map(productData => ProductFactory.fromData(productData))
    );
  }

  // NEEDS_WORK: service should be parameterized with the category ID and not some URL, it should know its endpoint itself
  /**
     * REST API - Get product list data
     * @param  {string} url category url
     * @returns List of products as observable
     */
  getProductList(url: string): Observable<Product[]> {
    return this.apiService.get<ProductData[]>(url, null, null, true, true).pipe(
      map(productsData => productsData.map(
        product => ProductFactory.fromData(product)
      ))
    );
  }

  getProductSkuListForCategory(categoryUniqueId: string, sortKey = ''): Observable<{ skus: string[], categoryUniqueId: string, sortKeys: string[] }> {
    let url = `categories/${categoryUniqueId.replace(/\./g, '/')}/products?returnSortKeys=true`;
    if (sortKey) { url += `&sortKey=${sortKey}`; }
    return this.apiService.get<any>(url, null, null, false, false).pipe(
      map(response => ({
        skus: response.elements.map(el => el.uri.split('/').pop()),
        sortKeys: response.sortKeys,
        categoryUniqueId: categoryUniqueId
      }))
    );
  }

}
