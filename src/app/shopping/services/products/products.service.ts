import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api/api.service';
import { CategoryHelper } from '../../../models/category/category.model';
import { ProductData, ProductDataStub } from '../../../models/product/product.interface';
import { ProductMapper } from '../../../models/product/product.mapper';
import { Product } from '../../../models/product/product.model';

/**
 * The Products Service handles the interaction with the 'products' REST API.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private apiService: ApiService) {}

  /**
   * Get the full Product data for the given Product SKU.
   * @param sku  The Product SKU for the product of interest.
   * @returns    The Product data.
   */
  getProduct(sku: string): Observable<Product> {
    if (!sku) {
      return throwError('getProduct() called without a sku');
    }

    const params = new HttpParams().set('allImages', 'true');

    return this.apiService.get<ProductData>(`products/${sku}`, { params }).pipe(map(ProductMapper.fromData));
  }

  /**
   * Get a sorted list of all products (as SKU list) assigned to a given Category respecting pagination.
   * @param categoryUniqueId  The unique Category ID.
   * @param page              The page to request (0-based numbering)
   * @param itemsPerPage      The number of items on each page.
   * @param sortKey           The sortKey to sort the list, default value is ''.
   * @returns                 A list of the categories products SKUs [skus], the unique Category ID [categoryUniqueId] and a list of possible sortings [sortKeys].
   */
  getCategoryProducts(
    categoryUniqueId: string,
    page: number,
    itemsPerPage: number,
    sortKey = ''
  ): Observable<{ products: Product[]; categoryUniqueId: string; sortKeys: string[]; total: number }> {
    if (!categoryUniqueId) {
      return throwError('getCategoryProducts() called without categoryUniqueId');
    }

    let params = new HttpParams()
      .set('attrs', 'sku,salePrice,listPrice,availability,manufacturer,image')
      .set('amount', itemsPerPage.toString())
      .set('offset', (page * itemsPerPage).toString())
      .set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    return this.apiService
      .get<{ elements: ProductDataStub[]; sortKeys: string[]; categoryUniqueId: string; total: number }>(
        `categories/${CategoryHelper.getCategoryPath(categoryUniqueId)}/products`,
        { params }
      )
      .pipe(
        map(response => ({
          products: response.elements.map((element: ProductDataStub) => ProductMapper.fromStubData(element) as Product),
          sortKeys: response.sortKeys,
          categoryUniqueId,
          total: !!response.total ? response.total : response.elements.length,
        }))
      );
  }

  /**
   * Get products for a given search term respecting pagination.
   * @param searchTerm    The search term to look for matching products.
   * @param page          The page to request (0-based numbering)
   * @param itemsPerPage  The number of items on each page.
   * @returns             A list of matching Product stubs with a list of possible sortings and the total amount of results.
   */
  searchProducts(
    searchTerm: string,
    page: number,
    itemsPerPage: number
  ): Observable<{ products: Product[]; sortKeys: string[]; total: number }> {
    if (!searchTerm) {
      return throwError('searchProducts() called without searchTerm');
    }

    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('amount', itemsPerPage.toString())
      .set('offset', (page * itemsPerPage).toString())
      .set('attrs', 'sku,salePrice,listPrice,availability,manufacturer,image')
      .set('returnSortKeys', 'true');

    return this.apiService
      .get<{ elements: ProductDataStub[]; sortKeys: string[]; total: number }>('products', { params })
      .pipe(
        map(response => ({
          products: response.elements.map(element => ProductMapper.fromStubData(element) as Product),
          sortKeys: response.sortKeys,
          total: !!response.total ? response.total : response.elements.length,
        }))
      );
  }
}
