import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService extends GlobalStateAwareService<Category> {

  constructor(private apiService: ApiService) {
    super('currentSubCategory', false, true);
  }
  /**
   * @returns List of categories as an Observable
   */
  getCategories(uri: string): Observable<Category[]> {
    return this.apiService.get(uri, null, null, true);
  }

  setCurrentCategory(subCategory: Category): void {
    this.next(subCategory);
  }

  // Fetches the data for category clicked
  getCategory(uri: string): Observable<Category> {
    return this.apiService.get(uri, null, null, false);
  }
}




