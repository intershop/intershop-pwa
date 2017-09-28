import { HttpParams } from '@angular/common/http';
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
   * REST API - Get top level categories
   * @param limit  The number of levels to be returned (depth) in hierarchical view.
   * @returns      List of top level categories.
   */
  getTopLevelCategories(limit: number): Observable<Category[]> {
    let params = new HttpParams().set('imageView', 'NO-IMAGE');
    if (limit > 0) {
      params = params.set('view', 'tree').set('limit', limit.toString());
    }
    return this.apiService.get('categories', params , null, true);
  }

  setCurrentCategory(subCategory: Category): void {
    this.next(subCategory);
  }
}




