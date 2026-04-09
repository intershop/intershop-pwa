import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CostCenterFormComponent } from '../../components/cost-center-form/cost-center-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterCsvImportComponent } from './cost-center-csv-import/cost-center-csv-import.component';

@Component({
  selector: 'ish-cost-center-create-page',
  templateUrl: './cost-center-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CostCenterFormComponent,
    CostCenterCsvImportComponent,
    FormSubmitDirective,
    LoadingComponent,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
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
