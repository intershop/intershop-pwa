import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, map, of, take } from 'rxjs';

import { CostCenterQuery } from 'ish-core/models/cost-center-query/cost-center-query.model';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PagingData } from 'ish-core/models/paging/paging.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

type CostCenterColumnsType = 'costCenterId' | 'costCenterName' | 'costCenterManager' | 'costCenterBudget' | 'actions';

@Component({
  selector: 'ish-cost-centers-page',
  templateUrl: './cost-centers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCentersPageComponent implements OnInit {
  costCenters$: Observable<CostCenter[]>;
  costCentersError$: Observable<HttpError>;
  costCentersLoading$: Observable<boolean>;
  costCentersForPage$: Observable<CostCenter[]>;
  pagingData$: Observable<PagingData>;
  pageSize = 5;

  private destroyRef = inject(DestroyRef);
  private pageNumberSubject = new BehaviorSubject<number>(1);
  pageNumber$ = this.pageNumberSubject.asObservable();

  columnsToDisplay: CostCenterColumnsType[] = [
    'costCenterId',
    'costCenterName',
    'costCenterManager',
    'costCenterBudget',
    'actions',
  ];

  /**
   * keep cost center for usage in confirmation dialogs (delete/deactivate)
   */
  selectedCostCenter: CostCenter;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.costCenters$ = this.organizationManagementFacade.costCenters$;
    this.costCentersError$ = this.organizationManagementFacade.costCentersError$;
    this.costCentersLoading$ = this.organizationManagementFacade.costCentersLoading$;
    this.pagingData$ = this.organizationManagementFacade.costCentersPagingData$;
    this.getCostCentersForPage();
  }

  openConfirmationDialog(costCenter: CostCenter, modal: ModalDialogComponent<string>) {
    this.selectedCostCenter = costCenter;
    modal.show();
  }

  private getCostCentersForPage() {
    this.costCentersForPage$ = combineLatest([this.costCenters$, this.pageNumber$]).pipe(
      map(([costCenters, pageNumber]) => {
        const start = (pageNumber - 1) * this.pageSize;
        const end = start + this.pageSize;
        return costCenters.filter(
          costCenter => costCenter.paginationPosition >= start && costCenter.paginationPosition < end
        );
      })
    );
  }

  loadMoreCostCenters(pageNumber: number): void {
    this.pageNumberSubject.next(pageNumber);

    this.costCenters$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(costCenters => {
      if (!costCenters.find(costCenter => costCenter.paginationPosition === (pageNumber - 1) * this.pageSize)) {
        this.organizationManagementFacade.loadCostCenters({
          offset: (pageNumber - 1) * this.pageSize,
          limit: this.pageSize,
        });
      }
    });
  }

  getTotalPages(totalCostCenters: number) {
    return Math.ceil(totalCostCenters / this.pageSize);
  }

  loadFilteredCostCenters(filters: Partial<CostCenterQuery>) {
    this.organizationManagementFacade.loadCostCenters({
      offset: 0,
      limit: this.pageSize,
      costCenterId: filters.costCenterId,
      name: filters.name,
    });
  }

  /** Deletes the cost center */
  delete() {
    this.organizationManagementFacade.deleteCostCenter(this.selectedCostCenter.id);
  }

  deactivate() {
    this.organizationManagementFacade.updateCostCenter({ ...this.selectedCostCenter, active: false });
  }

  activate(costCenter: CostCenter) {
    this.organizationManagementFacade.updateCostCenter({ ...costCenter, active: true });
  }

  isDeletable(costCenter: CostCenter): Observable<boolean> {
    return this.organizationManagementFacade.isCostCenterEditable(of(costCenter));
  }
}
