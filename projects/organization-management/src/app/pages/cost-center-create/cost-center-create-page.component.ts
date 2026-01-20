import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { DirectivesModule } from 'ish-core/directives.module';
import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterCsvImportComponent } from './cost-center-csv-import/cost-center-csv-import.component';

@Component({
  selector: 'ish-cost-center-create-page',
  templateUrl: './cost-center-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CostCenterCsvImportComponent,
    DirectivesModule,
    LoadingComponent,
    NgIf,
    OrganizationManagementModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
})
export class CostCenterCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;

  form = new UntypedFormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }

  submitForm() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const costCenter: CostCenterBase = {
        id: undefined,
        costCenterId: formValue.costCenterId,
        name: formValue.name,
        budget: { value: formValue.budgetValue, currency: formValue.currency, type: 'Money' },
        budgetPeriod: formValue.budgetPeriod,
        costCenterOwner: { login: formValue.costCenterManager },
        active: formValue.active,
      };

      this.organizationManagementFacade.addCostCenter(costCenter);
    }
  }
}
