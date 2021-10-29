import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@GenerateLazyComponent()
@Component({
  selector: 'ish-cost-center-widget',
  templateUrl: './cost-center-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterWidgetComponent implements OnInit {
  costCenters$: Observable<CostCenter[]>;
  loading$: Observable<boolean>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.costCenters$ = this.organizationManagementFacade.costCentersOfCurrentUser$().pipe(
      whenTruthy(),
      map(costCenters => costCenters.slice(0, 3))
    );
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }
}
