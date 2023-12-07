import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { loadGroups } from '../store/organization-hierarchies';

/**
 * Fetch hierachies groups for hierarchies page module
 */
export function fetchHierachiesGroupsGuard(): boolean | Observable<boolean> {
  const store = inject(Store);
  store.dispatch(loadGroups());
  return of(true);
}
