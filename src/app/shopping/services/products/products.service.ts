import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../models/product.model';

@Injectable()
export class ProductsService {

  private serviceIdentifier = 'products';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * REST API - Get product data
   * @param productSku  The category id path for the category of interest.
   * @returns           Product information.
   */
  getProduct(productSku: string): Observable<Product> {
    if (!productSku) {
      return ErrorObservable.create('getProduct() called without a productSku');
    }
    return this.apiService.get(this.serviceIdentifier + '/' + productSku, null, null, false, false);
  }

  // NEEDS_WORK: service should be parameterized with the category ID and not some URL, it should know its endpoint itself, it should not return an Observable of <any>
  /**
   * @returns List of products as observable
   */
  getProductList(url: string): Observable<any> {
    return this.apiService.get(url, null, null, true, true);
  }
}
