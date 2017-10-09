import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../';

@Injectable()
export class ProductListService {


  /**
   * @param  {ApiService} privateapiService
   */
  constructor(private apiService: ApiService) { }

  /**
   * @returns List of products as observable
   */
  getProductList(params: any): Observable<any> {
    const url = `categories/${params.category}/${params.subcategory}/products`;
    return this.apiService.get(url, null, null, true, true);
  }
}
