import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { OrganizationManagementBreadcrumbService } from 'organization-management';
import { map } from 'rxjs/operators';

import { setBreadcrumbData } from 'ish-core/store/core/viewconf';

@Injectable()
export class OrganizationManagementEffects {
  constructor(private organizationManagementBreadcrumbService: OrganizationManagementBreadcrumbService) {}

  setOrganizationManagementBreadcrumb$ = createEffect(() =>
    this.organizationManagementBreadcrumbService
      .breadcrumb$('/account/organization')
      .pipe(map(breadcrumbData => setBreadcrumbData({ breadcrumbData })))
  );
}
