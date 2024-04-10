import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

/**
 * Fetch information whether the organization hierarchies service is available.
 */
export function isServiceAvailable(): boolean | Observable<boolean> {
  const organizationHierarchiesFacade = inject(OrganizationHierarchiesFacade);

  return organizationHierarchiesFacade.isServiceAvailable$;
}
