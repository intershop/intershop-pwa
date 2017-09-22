import { Injectable } from '@angular/core';
import { ICategoryService } from './index';
import { Observable } from 'rxjs/Observable';
import { data } from './filter-list.mock';
import { FilterListModel } from './filter-entries';

@Injectable()
export class   FilterListMockService implements ICategoryService {

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<FilterListModel> {
    return Observable.of(data as FilterListModel);
  }

}
