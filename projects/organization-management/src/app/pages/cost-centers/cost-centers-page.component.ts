import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, of, take, takeUntil } from 'rxjs';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
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
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  csvData$: Observable<CostCenter[]>;
  private destroy$: Subject<void> = new Subject<void>();

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
    this.error$ = this.organizationManagementFacade.costCentersError$;
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }

  openConfirmationDialog(costCenter: CostCenter, modal: ModalDialogComponent<string>) {
    this.selectedCostCenter = costCenter;
    modal.show();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseCSV(csvText: string) {
    const lines = csvText.split('\n').filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim());

    const parsedData: Partial<CostCenter>[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Partial<CostCenter> = {};
      let budgetValue: number | undefined;
      let budgetCurrency: string | undefined;
      let costCenterOwnerEmail: string | undefined;
      let costCenterOwnerFirstName: string | undefined;
      let costCenterOwnerLastName: string | undefined;
      let costCenterOwnerLogin: string | undefined;
      let spentBudgetCurrency: string | undefined;
      let spentBudgetValue: number | undefined;
      let remainingBudgetCurrency: string | undefined;
      headers.forEach((header, index) => {
        const value = values[index];

        switch (header) {
          case 'budgetValue':
            budgetValue = +value;
            break;
          case 'budgetCurrency':
            budgetCurrency = value;
            break;
          case 'costCenterOwnerEmail':
            costCenterOwnerEmail = value;
            break;
          case 'costCenterOwnerFirstName':
            costCenterOwnerFirstName = value;
            break;
          case 'costCenterOwnerLastName':
            costCenterOwnerLastName = value;
            break;
          case 'costCenterOwnerLogin':
            costCenterOwnerLogin = value;
            break;
          case 'spentBudgetCurrency':
            spentBudgetCurrency = value;
            break;
          case 'spentBudgetValue':
            spentBudgetValue = +value;
            break;
          case 'remainingBudgetCurrency':
            remainingBudgetCurrency = value;
            break;
          default:
            (obj as Record<string, string>)[header] = value;
            break;
        }
      });

      if (budgetValue !== undefined && budgetCurrency) {
        obj.budget = {
          type: 'Money',
          value: budgetValue,
          currency: budgetCurrency,
        };
      }

      if (costCenterOwnerEmail && costCenterOwnerFirstName && costCenterOwnerLastName && costCenterOwnerLogin) {
        obj.costCenterOwner = {
          login: costCenterOwnerLogin,
          firstName: costCenterOwnerFirstName,
          lastName: costCenterOwnerLastName,
          email: costCenterOwnerEmail,
        };
      }

      if (spentBudgetCurrency && spentBudgetValue) {
        obj.spentBudget = {
          type: 'Money',
          value: spentBudgetValue,
          currency: spentBudgetCurrency,
        };
      }

      if (remainingBudgetCurrency) {
        obj.remainingBudget = {
          type: 'Money',
          value: Math.min(budgetValue - spentBudgetValue, 0),
          currency: spentBudgetCurrency,
        };
      }

      return obj;
    });

    this.csvData$ = of(parsedData as CostCenter[]);
    this.addCsvToCostCenters();
  }

  addCsvToCostCenters() {
    combineLatest([this.costCenters$.pipe(take(1)), this.csvData$.pipe(take(1))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([apiData, csvData]) => {
        const combined = [...apiData, ...csvData];
        this.costCenters$ = of(combined);
      });
  }
}
