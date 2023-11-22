import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryHelper } from 'ish-core/models/category/category.model';
import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService, private filterNavigationMapper: FilterNavigationMapper) {}

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const category = CategoryHelper.getCategoryPath(categoryUniqueId);
    return this.apiService
      .get<FilterNavigationData>(`categories/${category}/productfilters`, { sendSPGID: true })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`productfilters`, {
        sendSPGID: true,
        params: new HttpParams().set('searchTerm', searchTerm),
      })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  getFilterForMaster(masterSKU: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`productfilters`, {
        sendSPGID: true,
        params: new HttpParams().set('MasterSKU', masterSKU),
      })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    const category = searchParameter.getSingle('category');

    if (category) {
      searchParameter.delete('category');
    }
    const params = searchParameter.appendToHttpParams();
    
    const resource = category
      ? `categories/${category}/productfilters`
      : 'productfilters';

    return this.apiService
      .get<FilterNavigationData>(resource, { params })
      .pipe(map(filter => this.filterNavigationMapper.fromData(filter)));
  }
}
