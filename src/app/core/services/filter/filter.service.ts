import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { Category } from '../../models/category/category.model';
import { FilterNavigationData } from '../../models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from '../../models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from '../../models/filter-navigation/filter-navigation.model';
import { Link } from '../../models/link/link.model';
import { SearchParameterMapper } from '../../models/search-parameter/search-parameter.mapper';
import { SearchParameter } from '../../models/search-parameter/search-parameter.model';
import { ApiService, unpackEnvelope } from '../api/api.service';

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
    return this.apiService.get<FilterNavigationData>('filters', { params, skipApiErrorHandling: true }).pipe(
      map(filter => FilterNavigationMapper.fromData(filter)),
      // TODO: temporary work-around to omit errors until Filter REST API 2.0 is used
      // tslint:disable-next-line:ban
      catchError(() => of(FilterNavigationMapper.fromData(undefined)))
    );
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    const searchParameter = SearchParameterMapper.toData({ queryTerm: searchTerm } as SearchParameter);
    return this.apiService
      .get<FilterNavigationData>(`filters/default;SearchParameter=${searchParameter}`, { skipApiErrorHandling: true })
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  applyFilter(searchParameter: string): Observable<FilterNavigation> {
    return this.apiService
      .get<FilterNavigationData>(`filters/default;SearchParameter=${searchParameter}`)
      .pipe(map(filter => FilterNavigationMapper.fromData(filter)));
  }

  getProductSkusForFilter(searchParameter: string): Observable<string[]> {
    return this.apiService.get(`filters/default;SearchParameter=${searchParameter}/hits`).pipe(
      unpackEnvelope<Link>(),
      map(e => e.map(l => l.uri).map(ProductMapper.parseSKUfromURI))
    );
  }

  private getDomainId(rootName: string) {
    if (rootName === 'Specials' || rootName === 'Cameras-Camcorders') {
      return 'inSPIRED-inTRONICS-' + rootName;
    }
    return 'inSPIRED-' + rootName;
  }
}
