import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService {

  /**
   * @param  {ApiService} privateapiService
   */
  constructor(private apiService: ApiService) {
  }
  /**
   * @returns List of categories as an Observable
   */
  getCategories(uri: string): Observable<Category[]> {
    return this.apiService.get(uri, null, null, true);
  }
}




