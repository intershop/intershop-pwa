import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, catchError, concatMap, from, map, of, take, takeUntil, tap } from 'rxjs';

import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

type CostCenterColumnsType =
  | 'costCenterId'
  | 'costCenterName'
  | 'costCenterManager'
  | 'costCenterBudget'
  | 'costCenterBudgetPeriod'
  | 'status';

@Component({
  selector: 'ish-cost-center-import-page',
  templateUrl: './cost-center-import-page.component.html',
  styleUrls: ['./cost-center-import-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterImportPageComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  csvData$: Observable<CostCenter[]>;
  loading$: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  columnsToDisplay: CostCenterColumnsType[] = [
    'costCenterId',
    'costCenterName',
    'costCenterManager',
    'costCenterBudget',
    'costCenterBudgetPeriod',
    'status',
  ];

  constructor(private cdr: ChangeDetectorRef, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.csvData$ = of([]);
    this.loading$ = false;
  }

  openFileExplorer() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.name.endsWith('.csv')) {
        alert('Please chose a CSV-file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        this.parseCSV(text);
      };
      reader.readAsText(file);
    }
  }

  parseCSV(csvText: string) {
    this.loading$ = true;
    const lines = csvText.split('\n').filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim());

    const parsedData: Partial<CostCenterBase>[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Partial<CostCenterBase> = {};
      let budgetValue: number | undefined;
      let budgetCurrency: string | undefined;
      let costCenterOwnerLogin: string | undefined;

      headers.forEach((header, index) => {
        const value = values[index];

        switch (header) {
          case 'budgetValue':
            budgetValue = +value;
            break;
          case 'budgetCurrency':
            budgetCurrency = value;
            break;
          case 'costCenterOwnerLogin':
            costCenterOwnerLogin = value;
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

      if (costCenterOwnerLogin) {
        obj.costCenterOwner = {
          login: costCenterOwnerLogin,
        };
      }

      return obj;
    });

    this.csvData$ = of(parsedData as CostCenter[]);
    this.loading$ = false;
    this.cdr.detectChanges();
  }

  updateCostCenterStatus(costCenterId: string, status$: Observable<{ success: boolean; message?: string }>) {
    status$.pipe(take(1), takeUntil(this.destroy$)).subscribe(status => {
      const newStatus = status.success ? 'Success' : `Error: ${status.message || 'Unknown error'}`;
      this.csvData$ = this.csvData$.pipe(
        map(centers => centers.map(cc => (cc.costCenterId === costCenterId ? { ...cc, status: newStatus } : cc)))
      );
      this.cdr.detectChanges();
    });
  }

  submitCostCenterImports() {
    if (this.csvData$) {
      this.csvData$
        .pipe(
          take(1),
          concatMap((costCenters: CostCenter[]) =>
            from(costCenters).pipe(
              concatMap(costCenter => {
                const costCenterBase: CostCenterBase = {
                  id: undefined,
                  ...costCenter,
                };
                return this.organizationManagementFacade.addCostCenterFromCSV(costCenterBase).pipe(
                  tap(result => {
                    const status = result ? { success: true } : { success: false };
                    this.updateCostCenterStatus(costCenter.costCenterId, of(status));
                  }),
                  catchError(err => {
                    const errorMessage = err.errors?.length ? err.errors[0].message : err.message;
                    this.updateCostCenterStatus(costCenter.costCenterId, of({ success: false, message: errorMessage }));
                    return of(undefined);
                  })
                );
              })
            )
          ),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: () => {},
          error: () => {},
          complete: () => {},
        });
    }
  }
}
