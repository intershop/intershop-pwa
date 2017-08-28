import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductList } from './products.mock';
import { IProductListService } from './products.service';

@Injectable()
export class ProductListMockService implements IProductListService {

  /**
   * @returns Products to be displayed as Observable
   */
  getProductList(): Observable<any> {
    return Observable.of(ProductList);
  }
}
