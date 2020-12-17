import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getGroupsOfOrganization, getGroupsOfOrganizationCount } from '../store/group';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade {
  constructor(private store: Store) {}

  groups$ = this.store.pipe(select(getGroupsOfOrganization));

  groupsCount$ = this.store.pipe(select(getGroupsOfOrganizationCount));
}
