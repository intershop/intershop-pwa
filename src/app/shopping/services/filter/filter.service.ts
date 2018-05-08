import { FilterProducts } from './../../store/filter/filter.actions';
import { CoreState } from './../../../core/store/core.state';
import { Subject } from 'rxjs/Subject';
import { FilterNavigation } from './../../../models/filter-navigation/filter-navigation.model';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './../../../core/services/api.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class FilterService {
  filter: Subject<FilterNavigation> = new Subject();

  constructor(private apiService: ApiService, private store: Store<CoreState>) {}

  getFilter(): Observable<FilterNavigation> {
    return this.filter;
  }
  changeToFilterForCategory(categoryDomainName: string, categoryName: string) {
    console.log("w");
    let params = new HttpParams()
      .set('CategoryDomainName', 'inSPIRED-inTRONICS-' + categoryDomainName)
      .set('CategoryName', categoryName);
    return this.apiService.get<FilterNavigation>('filters', params);
  }

  changeToFilter(filterId: string, searchParameter: string) {
    let params = new HttpParams().set('SearchParameter', searchParameter);
    this.apiService.get<FilterNavigation>('filters/' + filterId, params).subscribe(filter => this.filter.next(filter));
    this.store.dispatch(new FilterProducts(''));
    this.apiService
      .get<FilterNavigation>('filters/' + filterId + '/hits', params)
      .subscribe(product => console.log(product));
  }
  changeToAvailableFilter() {
    this.apiService.get<FilterNavigation>('filters').subscribe(filter => this.filter.next(filter));
  }
}
