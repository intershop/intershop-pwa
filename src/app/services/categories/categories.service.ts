import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ApiService } from '../api.service';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService implements Resolve<Category> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category> {
    const categoryPath = route.url.map(x => x.path).join('/');
    // TODO: redirect to /error when category not found
    return this.getCategory(categoryPath);
  }

  constructor(private apiService: ApiService) {
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
   * @param categoryId  The category id path for the category of interest.
   * @returns           Category information.
   */
  getCategory(categoryId: string): Observable<Category> {
    return this.apiService.get('categories/' + categoryId, null, null, false);
  }


  // TODO: this method should become obsolete as soon as the categrory REST call will return the category path too
  /**
   * Helper function to get the category path for a given category with the help of the current route.
   * @param category        The category the category path should be gotten for.
   * @param activatedRoute  The currently activated route that is used to determine the category path.
   * @returns               A Category array that represents the categroy path from root to the category.
   */
  getCategoryPath(category: Category, activatedRoute: ActivatedRouteSnapshot): Observable<Category[]> {
    const observableArray: Observable<Category>[] = [];
    let categoryId = '';

    for (const urlSegment of activatedRoute.url) {
      categoryId = categoryId + urlSegment.path;
      observableArray.push(this.getCategory(categoryId));
      categoryId = categoryId + '/';
    }

    return forkJoin(observableArray);
    // TODO: optimazation option: do not get the category itself again but use the provided category as input for the array (wraped in an Observable)
  }

  /**
   * Helper function to compare two categories
   * @param category1  The first category to be compared with the second.
   * @param category2  The second category to be compared with the first.
   * @returns          True if the categories are the equal, false if not.
   */
  isCategoryEqual(category1: Category, category2: Category): boolean {
    return category1 && category2 && category1.id === category2.id;
  }

  /**
   * Helper function to generate the applications category route from the categories REST API uri
   * @param category  The category the application route should be generated for.
   * @returns         The application /category route string for the given category.
   */
  generateCategoryRoute(category: Category): string {
    return '/category/' + category.uri.split('/categories/')[1];
  }
}
