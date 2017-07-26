import { Injectable } from '@angular/core';
import { ICategoryService } from './index';
import { Observable } from 'rxjs/Observable';
import { data } from '../filterList.mock';

@Injectable()
export class CategoryMockService implements ICategoryService {

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<any> {
    return Observable.of(data);
  }

}
