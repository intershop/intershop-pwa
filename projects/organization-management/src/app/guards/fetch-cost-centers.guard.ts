import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { loadCostCenters } from '../store/cost-centers';

/**
 * Fetch cost centers for cost center management page
 */
export function fetchCostCentersGuard(): boolean | Observable<boolean> {
  const store = inject(Store);

  store.dispatch(loadCostCenters());
  return of(true);
}
