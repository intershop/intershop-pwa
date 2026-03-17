import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { CostCenterBudgetComponent } from '../cost-center-budget/cost-center-budget.component';

@Component({
  selector: 'ish-cost-center-widget',
  templateUrl: './cost-center-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, CostCenterBudgetComponent, TranslatePipe, InfoBoxComponent, LoadingComponent, RouterLink],
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
