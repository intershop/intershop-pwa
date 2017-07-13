import {Injectable} from '@angular/core'
import {ICategoryService} from './categoryList.service';
import {Observable} from 'rxjs/Observable';
import {Data} from '../categoryList.mock';

@Injectable()
export class CategoryMockService implements ICategoryService {

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<any> {
    return Observable.of(Data);
  }

}





