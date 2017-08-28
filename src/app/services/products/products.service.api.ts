import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { IProductListService } from './products.service';
import { ApiService } from 'app/services/api.service';


@Injectable()
export class ProductListApiService implements IProductListService {
  apiService;
  url: string = 'categories/Cameras-Camcorders/584/products/3953312';

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
    return this.apiService.get(this.url);
  }
}
