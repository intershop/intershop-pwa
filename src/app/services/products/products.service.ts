import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../api.service';

@Injectable()
export class ProductListService {
  public url = 'categories/Cameras-Camcorders/584/products/3953312';

  /**
   * @param  {ApiService} privateapiService
   */
  constructor(private apiService: ApiService) { }

  /**
   * @returns List of products as observable
   */
  getProductList(): Observable<any> {
    return this.apiService.get(this.url);
  }
}
