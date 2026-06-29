import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { CsvImportData, CsvImportHandler, CsvImportStatus } from 'ish-core/utils/csv/csv.import-handler';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-csv-import',
  imports: [ReactiveFormsModule, TranslatePipe],
  standalone: true,
  templateUrl: './cost-center-csv-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterCsvImportComponent implements OnInit {
  csvForm: FormGroup;
  status: CsvImportStatus = 'Default';
  // not-dead-code
  parsedCostCenters: CostCenterBase[];
  // not-dead-code
  costCenterHeaders = [
    'costCenterId',
    'name',
    'budgetCurrency',
    'budgetValue',
    'budgetPeriod',
    'costCenterOwnerLogin',
    'active',
  ];

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private organizationManagementFacade: OrganizationManagementFacade,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.parsedCostCenters = [];
    this.csvForm = this.fb.group({
      csvFile: [undefined],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    CsvImportHandler.processCsvFile(file, this.costCenterHeaders)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fileContent => {
          this.parsedCostCenters = this.parseCsvData(fileContent);
          this.status = 'Valid';
          this.cdRef.markForCheck();
        },
        error: error => {
          this.status = error;
          this.parsedCostCenters = [];
          this.cdRef.markForCheck();
        },
      });
  }

  // not-dead-code
  parseCsvData(csvData: CsvImportData): CostCenterBase[] {
    if (!csvData) {
      return [];
    }

    return csvData.data.map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Partial<CostCenterBase> = {};
      let budgetCurrency: string | undefined;
      let budgetValue: number | undefined;
      let costCenterOwnerLogin: string | undefined;

      csvData.headers.forEach((header, index) => {
        const value = values[index] !== undefined ? values[index] : '';

        switch (header) {
          case 'budgetCurrency':
            budgetCurrency = value;
            break;
          case 'budgetValue':
            budgetValue = value.trim() !== '' ? +value : undefined;
            break;
          case 'costCenterOwnerLogin':
            costCenterOwnerLogin = value;
            break;
          case 'active':
            obj.active = value.trim() !== '' ? value?.toLowerCase() === 'true' : undefined;
            break;
          default:
            (obj as Record<string, string>)[header] = value;
            break;
        }
      });

      obj.budget = {
        type: 'Money',
        value: budgetValue,
        currency: budgetCurrency,
      };

      obj.costCenterOwner = {
        login: costCenterOwnerLogin,
      };

      return obj as CostCenterBase;
    });
  }

  resetInput() {
    this.parsedCostCenters = [];
    this.status = 'Default';
  }

  submitCostCenters() {
    if (this.parsedCostCenters.length === 0) {
      return;
    }
    this.organizationManagementFacade.addCostCentersFromCsv(this.parsedCostCenters);
  }

  get isCsvDisabled() {
    return this.status !== 'Valid';
  }
}
