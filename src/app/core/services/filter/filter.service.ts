import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Link } from 'ish-core/models/link/link.model';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { SearchParameterMapper } from 'ish-core/models/search-parameter/search-parameter.mapper';
import { SearchParameter } from 'ish-core/models/search-parameter/search-parameter.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService, private filterNavigationMapper: FilterNavigationMapper) {}

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const idList = categoryUniqueId.split('.');
    // TODO from REST
    const categoryDomainName = this.getDomainId(idList[0]);
    const params = new HttpParams()
      .set('CategoryDomainName', categoryDomainName)
      .set('CategoryName', idList[idList.length - 1]);
    return this.apiService.get<FilterNavigationData>('filters', { params, skipApiErrorHandling: true }).pipe(
      map(filter => this.filterNavigationMapper.fromData(filter)),
      map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
    );
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    const searchParameter = SearchParameterMapper.toData({ queryTerm: searchTerm } as SearchParameter);
    return this.apiService
      .get<FilterNavigationData>(`filters/default;SearchParameter=${searchParameter}`, { skipApiErrorHandling: true })
      .pipe(
        map(filter => this.filterNavigationMapper.fromData(filter)),
        map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
      );
  }

  applyFilter(searchParameter: string): Observable<FilterNavigation> {
    return this.apiService.get<FilterNavigationData>(`filters/default;SearchParameter=${searchParameter}`).pipe(
      map(filter => this.filterNavigationMapper.fromData(filter)),
      map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
    );
  }

  getFilteredProducts(searchParameter: string): Observable<{ total: number; productSKUs: string[] }> {
    return this.apiService.get(`filters/default;SearchParameter=${searchParameter}/hits`).pipe(
      map((x: { total: number; elements: Link[] }) => ({
        productSKUs: x.elements.map(l => l.uri).map(ProductMapper.parseSKUfromURI),
        total: x.total,
      }))
    );
  }

  private getDomainId(rootName: string) {
    if (rootName === 'Specials' || rootName === 'Cameras-Camcorders') {
      return 'inSPIRED-inTRONICS-' + rootName;
    }
    return 'inSPIRED-' + rootName;
  }
}
