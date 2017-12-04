import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../core/services/api.service';

@Injectable()
export class ProductListService {

  /**
   * @param  {ApiService} private apiService
   */
  constructor(
    private apiService: ApiService
  ) { }

  /**
   * @returns List of products as observable
   */
  getProductList(url: string): Observable<any> {
    return this.apiService.get(url, null, null, true, true);
  }
}
