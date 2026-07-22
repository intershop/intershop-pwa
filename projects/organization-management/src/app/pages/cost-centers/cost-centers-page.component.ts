import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, map, of, take } from 'rxjs';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PagingInfo } from 'ish-core/models/paging-info/paging-info.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { CostCenterQuery } from '../../models/cost-center-query/cost-center-query.model';

type CostCenterColumnsType = 'actions' | 'costCenterBudget' | 'costCenterId' | 'costCenterManager' | 'costCenterName';

@Component({
  selector: 'ish-cost-centers-page',
  standalone: false,
  templateUrl: './cost-centers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCentersPageComponent implements OnInit {
  costCenters$: Observable<CostCenter[]>;
  costCentersError$: Observable<HttpError>;
  costCentersLoading$: Observable<boolean>;
  costCentersForPage$: Observable<CostCenter[]>;
  pagingInfo$: Observable<PagingInfo>;
  pageSize = 25;

  private activeFilters: Partial<CostCenterQuery> = {};
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
    this.pagingInfo$ = this.organizationManagementFacade.costCentersPagingInfo$;
    this.getCostCentersForPage();
  }

  openConfirmationDialog(costCenter: CostCenter, modal: ModalDialogComponent<string>) {
    this.selectedCostCenter = costCenter;
    if (this.isDeletable(costCenter)) {
      modal.show();
    }
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
          costCenterNameId: this.activeFilters.costCenterNameId ? this.activeFilters.costCenterNameId : undefined,
        });
      }
    });
  }

  getTotalPages(totalCostCenters: number) {
    return Math.ceil(totalCostCenters / this.pageSize);
  }

  loadFilteredCostCenters(filters: Partial<CostCenterQuery>) {
    this.activeFilters = filters;
    this.organizationManagementFacade.loadCostCenters({
      offset: 0,
      limit: this.pageSize,
      costCenterNameId: filters.costCenterNameId,
    });
    this.pageNumberSubject.next(1);
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

  isEditable(costCenter: CostCenter): Observable<boolean> {
    return this.organizationManagementFacade.isCostCenterEditable(of(costCenter));
  }

  isDeletable(cc: CostCenter): boolean {
    return !(cc.pendingOrders + cc.approvedOrders);
  }

  get filtersActive(): boolean {
    return Object.keys(this.activeFilters).length > 0;
  }
}
