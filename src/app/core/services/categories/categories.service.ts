import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { CategoryFactory } from '../../../models/category/category.factory';
import { CategoryData } from '../../../models/category/category.interface';
import { Category } from '../../../models/category/category.model';
import { ApiService } from '../api.service';

@Injectable()
export class CategoriesService {

  private serviceIdentifier = 'categories';

  constructor(
    private apiService: ApiService
  ) { }

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
    const rawCategories$ = this.apiService.get<CategoryData[]>(this.serviceIdentifier, params, null, true);
    if (rawCategories$) {
      return rawCategories$.pipe(
        map(
          (rawCategories: CategoryData[]) => {
            return rawCategories.map(
              (rawCategory: CategoryData) => CategoryFactory.fromData(rawCategory));
          })
      );
    }
    return null;
  }

  /**
   * REST API - Get info on (sub-)category
   * @param categoryId  The category id path for the category of interest.
   * @returns           Category information.
   */
  getCategory(categoryId: string): Observable<Category> {
    if (!categoryId) {
      return ErrorObservable.create('getCategory() called without categoryId');
    }
    const categoryData$ = this.apiService.get<CategoryData>(this.serviceIdentifier + '/' + categoryId, null, null, false);
    return categoryData$.pipe(
      map(rawCategory => CategoryFactory.fromData(rawCategory))
    );
  }

  // TODO: this method might become obsolete as soon as the category REST call will return the category path too
  /**
   * Helper function to get the category path from the current route.
   * @param activatedRoute  The currently activated route that is used to determine the category path.
   * @returns               A Category array that represents the category path from root to the category.
   */
  getCategoryPathFromRoute(activatedRoute: ActivatedRouteSnapshot): Observable<Category[]> {
    if (!activatedRoute || !activatedRoute.url) {
      return ErrorObservable.create('getCategoryPathFromRoute cannot act with missing or empty route snapshot');
    }

    const categories$: Observable<Category>[] = [];
    let categoryId = '';

    for (const urlSegment of activatedRoute.url) {
      // if the route reaches a 'product' segment, finish category path accumulation
      if (urlSegment.path === 'product') {
        break;
        // for all other segments fetch the according category information and add it to the category path
      } else {
        categoryId = categoryId + urlSegment.path;
        categories$.push(this.getCategory(categoryId));
        categoryId = categoryId + '/';
      }
    }
    return forkJoin(categories$);
  }

  /**
   * Helper function to generate the applications category route from the categories REST API uri
   * or alternatively from an additionally given categoryPath if no uri is available.
   * @param category      [required] The category the application route should be generated for.
   * @param categoryPath  [optional] The category path from root to the category as Category array. - This should be obsolete once the category REST call provided the category path itself.
   * @returns             The application /category route string for the given category.
   */
  generateCategoryRoute(category: Category, categoryPath?: Category[]): string {
    let categoryIdPath = '';
    let categoryIdPathIsValid = false;
    if (category) {
      if (category.uri) {
        categoryIdPath = category.uri.split(/\/categories[^\/]*/)[1];
        categoryIdPathIsValid = true;
      } else if (categoryPath && categoryPath.length) {
        for (const pathCategory of categoryPath) {
          categoryIdPath = categoryIdPath + '/' + pathCategory.id;
          if (pathCategory && pathCategory.equals(category)) {
            categoryIdPathIsValid = true;
            break;
          }
        }
      }
    }
    if (categoryIdPath && categoryIdPathIsValid) {
      return '/category' + categoryIdPath;
    } else {
      return '';
    }
  }
}
