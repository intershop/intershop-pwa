import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../core/services/api.service';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService) {}

  getFilter(categoryDomainName: string = null, categoryName: string = null): Observable<FilterNavigation> {
    if (categoryDomainName && categoryName) {
      const params = new HttpParams()
        .set('CategoryDomainName', 'inSPIRED-inTRONICS-' + categoryDomainName)
        .set('CategoryName', categoryName);
      return this.apiService.get<FilterNavigation>('filters', params);
    } else {
      return this.apiService.get<FilterNavigation>('filters');
    }
  }
}
