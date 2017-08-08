import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductList } from '../../family-page.mock';
import { IProductListService } from './product-list.service';

@Injectable()
export class ProductListMockService implements IProductListService {

  /**
   * @returns Products to be displayed as Observable
   */
  getProductList(): Observable<any> {
    return Observable.of(ProductList);
  }
}
