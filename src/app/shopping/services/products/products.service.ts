import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Attribute } from '../../../models/attribute/attribute.model';
import { CategoryHelper } from '../../../models/category/category.model';
import { ProductData } from '../../../models/product/product.interface';
import { ProductMapper } from '../../../models/product/product.mapper';
import { Product, ProductHelper } from '../../../models/product/product.model';

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

    const params: HttpParams = new HttpParams().set('allImages', 'true');

    return this.apiService
      .get<ProductData>(`products/${sku}`, params)
      .pipe(map(productData => ProductMapper.fromData(productData)));
  }

  /**
   * Get a sorted list of all products (as SKU list) assigned to a given Category.
   * @param categoryUniqueId  The unique Category ID.
   * @param sortKey           The sortKey to sort the list, default value is ''.
   * @returns                 A list of the categories products SKUs [skus], the unique Category ID [categoryUniqueId] and a list of possible sortings [sortKeys].
   */
  // TODO: handle and document paging
  getCategoryProducts(
    categoryUniqueId: string,
    sortKey = ''
  ): Observable<{ skus: string[]; categoryUniqueId: string; sortKeys: string[] }> {
    if (!categoryUniqueId) {
      return throwError('getCategoryProducts() called without categoryUniqueId');
    }

    let params: HttpParams = new HttpParams().set('attrs', 'sku').set('returnSortKeys', 'true');
    if (sortKey) {
      params = params.set('sortKey', sortKey);
    }

    return this.apiService
      .get<{ elements: { attributes: Attribute[] }[]; sortKeys: string[]; categoryUniqueId: string }>(
        `categories/${CategoryHelper.getCategoryPath(categoryUniqueId)}/products`,
        params
      )
      .pipe(
        map(response => ({
          skus: response.elements.map(
            (element: Product) => ProductHelper.getAttributeByAttributeName(element, 'sku').value
          ),
          sortKeys: response.sortKeys,
          categoryUniqueId: categoryUniqueId,
        }))
      );
  }

  /**
   * Get products (as SKU list) for a given search term.
   * @param searchTerm  The search term to look for matching products.
   * @returns           A list of matching Product SKUs [skus] with a list of possible sortings [sortKeys].
   */
  // TODO: handle and document paging (total, offset, amount)
  searchProducts(searchTerm: string): Observable<{ skus: string[]; sortKeys: string[] }> {
    if (!searchTerm) {
      return throwError('searchProducts() called without searchTerm');
    }

    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('attrs', 'sku')
      .set('returnSortKeys', 'true');

    return this.apiService
      .get<{ elements: { attributes: Attribute[] }[]; sortKeys: string[] }>('products', params)
      .pipe(
        map(response => ({
          skus: response.elements.map(
            (element: Product) => ProductHelper.getAttributeByAttributeName(element, 'sku').value
          ),
          sortKeys: response.sortKeys,
        }))
      );
  }
}
