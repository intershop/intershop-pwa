import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
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
import { TranslateModule } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';

import { CsvImportData, CsvImportHandler, CsvImportStatus } from 'ish-core/utils/csv/csv.import-handler';

import { OrganizationManagementFacade } from '../../../facades/organization-management.facade';
import { B2bUser } from '../../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-csv-import',
  templateUrl: './user-csv-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault, ReactiveFormsModule, TranslateModule],
})
export class UserCsvImportComponent implements OnInit {
  csvForm: FormGroup;
  status: CsvImportStatus = 'Default';
  // not-dead-code
  parsedUsers: B2bUser[] = [];
  // not-dead-code
  userHeaders: string[] = [
    'title',
    'firstName',
    'lastName',
    'email',
    'phone',
    'active',
    'budgetCurrency',
    'budgetValue',
    'budgetPeriod',
    'orderSpentLimitCurrency',
    'orderSpentLimitValue',
    'APP_B2B_BUYER',
    'APP_B2B_ACCOUNT_OWNER',
    'APP_B2B_APPROVER',
    'APP_B2B_COSTCENTER_OWNER',
    'APP_B2B_COSTOBJECT_MANAGER',
  ];

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private organizationManagementFacade: OrganizationManagementFacade
  ) {}

  ngOnInit(): void {
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

    CsvImportHandler.processCsvFile(file, this.userHeaders)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fileContent => {
          this.parsedUsers = this.parseCsvData(fileContent);
          this.status = 'Valid';
          this.cdRef.markForCheck();
        },
        error: error => {
          this.status = error;
          this.parsedUsers = [];
          this.cdRef.markForCheck();
        },
      });
  }

  // not-dead-code
  parseCsvData(csvData: CsvImportData): B2bUser[] {
    if (!csvData?.data || csvData.data.length === 0) {
      return [];
    }

    return csvData.data.map(line => {
      const values = line.split(',').map(v => v.trim());
      const user: B2bUser = {
        businessPartnerNo: `U${uuid()}`,
        roleIDs: [],
        userBudget: {
          budget: { type: 'Money', value: undefined, currency: undefined },
          budgetPeriod: undefined,
          orderSpentLimit: { type: 'Money', value: undefined, currency: undefined },
        },
      };

      csvData.headers.forEach((header, index) => {
        const value = values[index] !== undefined ? values[index] : '';
        this.processUserField(user, header, value);
      });

      return user;
    });
  }

  private processUserField(user: B2bUser, header: string, value: string): void {
    if (this.isPersonalInfoField(header)) {
      this.processPersonalInfo(user, header, value);
    } else if (this.isBudgetField(header)) {
      this.processBudgetInfo(user, header, value);
    } else if (this.isRoleField(header)) {
      this.processRoleInfo(user, header, value);
    }
  }

  private isPersonalInfoField(header: string): boolean {
    return ['title', 'firstName', 'lastName', 'email', 'phone', 'active'].includes(header);
  }

  private isBudgetField(header: string): boolean {
    return [
      'budgetCurrency',
      'budgetValue',
      'budgetPeriod',
      'orderSpentLimitCurrency',
      'orderSpentLimitValue',
    ].includes(header);
  }

  private isRoleField(header: string): boolean {
    return [
      'APP_B2B_BUYER',
      'APP_B2B_ACCOUNT_OWNER',
      'APP_B2B_APPROVER',
      'APP_B2B_COSTCENTER_OWNER',
      'APP_B2B_COSTOBJECT_MANAGER',
    ].includes(header);
  }

  private processPersonalInfo(user: B2bUser, header: string, value: string): void {
    switch (header) {
      case 'title':
        user.title = value;
        break;
      case 'firstName':
        user.firstName = value;
        break;
      case 'lastName':
        user.lastName = value;
        break;
      case 'email':
        user.email = value;
        break;
      case 'phone':
        user.phoneHome = value;
        break;
      case 'active':
        user.active = value.toLowerCase() === 'true';
        break;
    }
  }

  private processRoleInfo(user: B2bUser, header: string, value: string): void {
    if (value.toLowerCase() === 'true') {
      user.roleIDs.push(header);
    }
  }

  private processBudgetInfo(user: B2bUser, header: string, value: string): void {
    if (!user.userBudget) {
      return;
    }

    switch (header) {
      case 'budgetCurrency':
        user.userBudget.budget.currency = value;
        break;
      case 'budgetValue':
        user.userBudget.budget.value = value ? parseInt(value, 10) : undefined;
        break;
      case 'budgetPeriod':
        user.userBudget.budgetPeriod = value;
        break;
      case 'orderSpentLimitCurrency':
        user.userBudget.orderSpentLimit.currency = value;
        break;
      case 'orderSpentLimitValue':
        user.userBudget.orderSpentLimit.value = value ? parseInt(value, 10) : undefined;
        break;
    }
  }

  resetInput() {
    this.parsedUsers = [];
    this.status = 'Default';
  }

  submitUsers() {
    if (this.parsedUsers.length === 0) {
      return;
    }
    this.organizationManagementFacade.addUsersFromCsv(this.parsedUsers);
  }

  get isCsvDisabled() {
    return this.status !== 'Valid';
  }
}
