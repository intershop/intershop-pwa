import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, unpackEnvelope } from '../../../core/services/api/api.service';
import { Category } from '../../../models/category/category.model';
import { FilterNavigationData } from '../../../models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from '../../../models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { Link } from '../../../models/link/link.model';
import { SearchParameterMapper } from '../../../models/search-parameter/search-parameter.mapper';
import { SearchParameter } from '../../../models/search-parameter/search-parameter.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService) {}

  getFilterForCategory(category: Category): Observable<FilterNavigation> {
    const idList = category.uniqueId.split('.');
    // TODO from REST
    const categoryDomainName = this.getDomainId(idList[0]);
    const params = new HttpParams()
      .set('CategoryDomainName', categoryDomainName)
      .set('CategoryName', idList[idList.length - 1]);
    return this.apiService
      .get<FilterNavigationData>('filters', { params })
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    const searchParameter = SearchParameterMapper.toData({ queryTerm: searchTerm } as SearchParameter);
    return this.apiService
      .get<FilterNavigationData>(`filters/blablub;SearchParameter=${searchParameter}`)
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  applyFilter(filterName: string, searchParameter: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`filters/${filterName};SearchParameter=${searchParameter}`)
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  getProductSkusForFilter(filterName: string, searchParameter: string): Observable<string[]> {
    return this.apiService
      .get<{ elements: Link[] }>(`filters/${filterName};SearchParameter=${searchParameter}/hits`)
      .pipe(
        unpackEnvelope(),
        map((e: Link[]) => e.map(n => n.uri.split('/')[1]))
      );
  }

  private getDomainId(rootName: string) {
    console.log(rootName);
    if (rootName === 'Specials' || rootName === 'Cameras') {
      return 'inSPIRED-inTRONICS-' + rootName;
    }
    return 'inSPIRED-' + rootName;
  }
}
