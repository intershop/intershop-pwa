import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../api.service';
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
    return this.apiService.get('categories', params, null, true);
  }

  /**
   * REST API - Get info on (sub-)category
   * @param categoryPath  The category id path for the category of interest.
   * @returns             Category information.
   */
  getCategory(categoryPath: string): Observable<Category> {
    return this.apiService.get('categories' + categoryPath, null, null, false);
  }

  /**
   * Helper function to generate the applications category route from the categories REST API uri
   * @param category  The category the application route should be generated for.
   * @returns         The application /category route string for the given category.
   */
  generateCategoryRoute(category: Category): string {
    return '/category/' + category.uri.split('/categories')[1];
  }
}
