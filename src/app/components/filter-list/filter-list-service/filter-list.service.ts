import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../services';
import { FilterListModel } from './filter-entries';

@Injectable()
export class FilterListService {

  url = 'filters/CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZPbmxpbmVGbGFnPTE=';

  /**
   * @param  {ApiService} privateapiService
   */
  constructor(private apiService: ApiService) {
  }

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<FilterListModel> {
    return this.apiService.get(this.url);
  }
}

