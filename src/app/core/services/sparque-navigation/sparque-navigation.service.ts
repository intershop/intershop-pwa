import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueCategoryTree } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { NavigationService } from 'ish-core/services/navigation/navigation.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

@Injectable({ providedIn: 'root' })
export class SparqueNavigationService extends NavigationService {
  constructor(private sparqueApiService: SparqueApiService, private categoryMapper: SparqueCategoryMapper) {
    super();
  }

  getTopLevelCategories(limit: number): Observable<CategoryTree> {
    const params = limit ? new HttpParams().set('Levels', limit) : new HttpParams();
    return this.sparqueApiService
      .get<SparqueCategoryTree>('categorytree', { params })
      .pipe(map(categoriesData => this.categoryMapper.fromData(categoriesData)));
  }
}
