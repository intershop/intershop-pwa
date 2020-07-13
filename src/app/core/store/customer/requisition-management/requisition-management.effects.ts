import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { RequisitionManagementBreadcrumbService } from 'requisition-management';
import { map } from 'rxjs/operators';

import { setBreadcrumbData } from 'ish-core/store/core/viewconf';

@Injectable()
export class RequisitionManagementEffects {
  constructor(private requisitionManagementBreadcrumbService: RequisitionManagementBreadcrumbService) {}

  setRequisitionManagementBreadcrumb$ = createEffect(() =>
    this.requisitionManagementBreadcrumbService
      .breadcrumb$('/account/requisitions')
      .pipe(map(breadcrumbData => setBreadcrumbData({ breadcrumbData })))
  );
}
