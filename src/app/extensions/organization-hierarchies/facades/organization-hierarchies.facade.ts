import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationGroup } from '../models/organization-group/organization-group.model';
import {
  assignGroup,
  getGroupDetails,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getSelectedGroupDetails,
  loadGroups,
} from '../store/group';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade {
  constructor(private store: Store) {}

  groups$ = this.store.pipe(select(getGroupsOfOrganization));

  getSelectedGroup$ = this.store.pipe(select(getSelectedGroupDetails));

  groupsCount$(): Observable<number> {
    const customer$ = this.store.pipe(select(getLoggedInCustomer));
    return customer$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadGroups())),
      switchMap(() => this.store.pipe(select(getGroupsOfOrganizationCount)))
    );
  }

  assignGroup(id: string): void {
    this.store.dispatch(assignGroup({ id }));
  }

  getDetailsOfGroup$(id: string): Observable<OrganizationGroup> {
    return this.store.pipe(select(getGroupDetails(id)));
  }
}
