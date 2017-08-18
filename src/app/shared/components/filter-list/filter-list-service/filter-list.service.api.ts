import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ICategoryService } from './index';
import { ApiService } from '../../../services/api.service';
import { FilterListModel } from '../filter-entries';

@Injectable()
export class FilterListApiService implements ICategoryService {
  apiService;
  url: string = 'filters/CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZPbmxpbmVGbGFnPTE=';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<FilterListModel> {
    return this.apiService.get(this.url);
  }
}
