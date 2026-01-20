import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { OrganizationManagementStoreModule } from '../../store/organization-management-store.module';
import { CostCenterBudgetComponent } from '../cost-center-budget/cost-center-budget.component';

@GenerateLazyComponent()
@Component({
  selector: 'ish-cost-center-widget',
  templateUrl: './cost-center-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CostCenterBudgetComponent,
    NgFor,
    NgIf,
    OrganizationManagementStoreModule,
    RouterModule,
    TranslateModule,
    InfoBoxComponent,
    LoadingComponent,
  ],
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
