import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { IProductListService } from './product-list.service';
import { ApiService } from '../../../../shared/services/api.service';


@Injectable()
export class ProductListApiService implements IProductListService {
  apiService;

  /**
   * Constructor
   * @param  {ApiService} apiService
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * @returns Products to be displayed as Observable
   */
  getProductList(): Observable<any> {
    return this.apiService.get('categories/Cameras-Camcorders/584/products/3953312');
  }
}
