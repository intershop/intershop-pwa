import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { CategoryData } from '../../../models/category/category.interface';
import { CategoryMapper } from '../../../models/category/category.mapper';
import { Category } from '../../../models/category/category.model';

@Injectable()
export class CategoriesService {
  private serviceIdentifier = 'categories';

  constructor(private apiService: ApiService) {}

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
    return this.apiService
      .get<CategoryData[]>(this.serviceIdentifier, params, null, true)
      .pipe(
        map(categoriesData =>
          categoriesData.map(categoryData => CategoryMapper.fromData(categoryData, categoryData.id))
        )
      );
  }

  /**
   * REST API - Get info on (sub-)category
   * @param categoryUniqueId  The unique category id for the category of interest (encodes the category path).
   * @returns                 Category information.
   */
  getCategory(categoryUniqueId: string): Observable<Category> {
    if (!categoryUniqueId) {
      return ErrorObservable.create('getCategory() called without categoryUniqueId');
    }
    const categoryResourceIdentifier = categoryUniqueId.replace(/\./g, '/');
    return this.apiService
      .get<CategoryData>(this.serviceIdentifier + '/' + categoryResourceIdentifier, null, null, false)
      .pipe(map(categoryData => CategoryMapper.fromData(categoryData, categoryUniqueId)));
  }
}
