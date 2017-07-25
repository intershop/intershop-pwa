import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ICategoryService } from './index';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class CategoryApiService implements ICategoryService {
  apiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * @returns List of categories as an Observable
   */
  getSideFilters(): Observable<any> {
    return this.apiService.get('url');
  }
}
