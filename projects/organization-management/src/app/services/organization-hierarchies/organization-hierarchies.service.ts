import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { GroupHelper } from '../../models/group/group.helper';
import { GroupDocument, GroupListDocument } from '../../models/group/group.interface';
import { GroupMapper } from '../../models/group/group.mapper';
import { Group, GroupTree } from '../../models/group/group.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private groupMapper: GroupMapper, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));
  private icmBaseURL$ = this.store.pipe(select(getICMBaseURL), whenTruthy(), take(1));

  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json', ['content-type']: 'application/vnd.api+json' }),
  };

  getGroups(customer: Customer): Observable<GroupTree> {
    return this.icmBaseURL$.pipe(
      switchMap(icmBaseURL =>
        this.apiService
          .get<GroupListDocument>(`${icmBaseURL}/organizations/${customer.customerNo}/groups`, this.contentTypeHeader)
          .pipe(
            map(data =>
              GroupHelper.setParent(this.groupMapper.fromCustomerData(customer), this.groupMapper.fromDocument(data))
            )
          )
      )
    );
  }

  createGroup(parent: Group, child: Group): Observable<GroupTree> {
    return this.currentCustomer$.pipe(
      withLatestFrom(this.icmBaseURL$),
      switchMap(([customer, icmBaseURL]) =>
        this.apiService
          .post<GroupDocument>(
            `${icmBaseURL}/organizations/${customer.customerNo}/groups`,
            this.groupMapper.toGroupDocument(child, parent.id === customer.customerNo ? undefined : parent),
            this.contentTypeHeader
          )
          .pipe(
            mapToProperty('data'),
            map(groupData => this.groupMapper.fromDataReversed(groupData))
          )
      )
    );
  }
}
