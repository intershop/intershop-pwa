import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

/**
 * Fetch cost centers for cost center management page
 */
export function isServiceAvailable(): boolean | Observable<boolean> {
  const organizationHierarchiesFacade = inject(OrganizationHierarchiesFacade);

  return organizationHierarchiesFacade.isServiceAvailable$;
}
