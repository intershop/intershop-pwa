import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationGroupListData } from '../../models/organization-group-list/organization-group-list.interface';
import { OrganizationGroupMapper } from '../../models/organization-group/organization-group.mapper';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private store: Store, private mapper: OrganizationGroupMapper) {}

  private icmBaseURL$ = this.store.pipe(select(getICMBaseURL), whenTruthy(), take(1));
  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json', ['content-type']: 'application/vnd.api+json' }),
  };

  getGroups(customer: Customer): Observable<OrganizationGroup[]> {
    return this.icmBaseURL$.pipe(
      switchMap(baseURL =>
        this.apiService
          .get<OrganizationGroupListData>(
            `${baseURL}/organizations/${customer.customerNo}/groups`,
            this.contentTypeHeader
          )
          .pipe(
            map(list =>
              list.data.map(this.mapper.fromData).map(item => this.mapper.handleRoot(item, customer.companyName))
            )
          )
      )
    );
  }
}
