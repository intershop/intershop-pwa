import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, combineLatest, map, of } from 'rxjs';

import { CostCenterImportResult } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-import-page',
  imports: [AsyncPipe, CdkTableModule, LoadingComponent, NgClass, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './cost-center-import-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterImportPageComponent implements OnInit {
  importedCostCenters$: Observable<CostCenterImportResult[]> = of([]);
  importProgress$: Observable<{
    total: number;
    current: number;
    percentage: number;
  }>;
  loading$: Observable<boolean>;

  columnsToDisplay = ['costCenterId', 'costCenterName', 'costCenterManager', 'costCenterBudget', 'status'];

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.importedCostCenters$ = this.organizationManagementFacade.costCentersImportResults$;

    this.importProgress$ = combineLatest([
      this.organizationManagementFacade.costCentersImportTotal$,
      this.importedCostCenters$,
    ]).pipe(
      map(([totalCostCentersToImport, importedCostCenters]) => ({
        total: totalCostCentersToImport,
        current: importedCostCenters.length,
        percentage:
          totalCostCentersToImport > 0 ? Math.round((importedCostCenters.length / totalCostCentersToImport) * 100) : 0,
      }))
    );

    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }
}
