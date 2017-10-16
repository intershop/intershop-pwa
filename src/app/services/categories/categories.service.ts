import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
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
   * @param categoryPath  The category id path for the category of interest.
   * @returns             Category information.
   */
  getCategory(categoryPath: string): Observable<Category> {
    return this.apiService.get('categories/' + categoryPath, null, null, false);
  }

  /**
   * Helper function to generate the applications category route from the categories REST API uri
   * @param category  The category the application route should be generated for.
   * @returns         The application /category route string for the given category.
   */
  generateCategoryRoute(category: Category): string {
    return '/category/' + category.uri.split('/categories/')[1];
  }

  /**
   * This functionality will be done at API in future. Takes uri of the current category and iterates through all the * subcategories to replace the IDs to their names and returns url with names instead of IDs.
   *
   * Takes current category's uri and returns url with names
   * @param  {string} currentUri
   * @returns Observable
   */
  getFriendlyPathOfCurrentCategory(currentUri: string): Observable<string[]> {
    return this.getTopLevelCategories(2).flatMap((categoryData: any) => {
      const topLevelCategory = new Category();
      topLevelCategory.subCategories = categoryData;
      return Observable.of(this.createFriendlyPath(topLevelCategory, currentUri.split('/'), []));
    });
  }

  /**
   * Helper function to convert ids to names in category uri
   * @param  {Category} categoriesData
   * @param  {string[]} categoryIdsArray
   * @param  {string[]} categoryNamesArray
   * @returns string
   */
  createFriendlyPath(categoriesData: Category, categoryIdsArray: string[], categoryNamesArray: string[]): string[] {
    if (!categoryIdsArray.length) {
      return categoryNamesArray;
    }
    const matchedCategory = categoriesData.subCategories.find((category) => {
      return category.id === categoryIdsArray[0];
    });
    categoryNamesArray.push(matchedCategory.name);
    return this.createFriendlyPath(matchedCategory, categoryIdsArray.splice(1), categoryNamesArray);
  }
}
