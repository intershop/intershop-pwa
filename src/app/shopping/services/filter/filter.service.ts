import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { FilterNavigationData } from '../../../models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from '../../../models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { Link } from '../../../models/link/link.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService) {}

  getFilterForCategory(categoryDomainName: string, categoryName: string): Observable<FilterNavigation> {
    const params = new HttpParams()
      .set('CategoryDomainName', 'inSPIRED-inTRONICS-' + categoryDomainName)
      .set('CategoryName', categoryName);
    return this.apiService
      .get<FilterNavigationData>('filters', params)
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  applyFilter(filterName: string, searchParameter: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>('filters/' + filterName + ';SearchParameter=' + searchParameter)
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  getProductSkusForFilter(filterName: string, searchParameter: string): Observable<string[]> {
    return this.apiService
      .get<{ elements: Link[] }>('filters/' + filterName + ';SearchParameter=' + searchParameter + '/hits')
      .pipe(map(e => e.elements), map((e: Link[]) => e.map(n => n.uri.split('/')[1])));
  }
}
