import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../store/organization-hierarchies-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  organizationHierarchiesState$ = this.store.pipe(select(getOrganizationHierarchiesState));
}
