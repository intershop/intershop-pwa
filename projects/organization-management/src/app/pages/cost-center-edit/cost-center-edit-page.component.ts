import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { DirectivesModule } from 'ish-core/directives.module';
import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { OrganizationManagementModule } from '../../organization-management.module';

@Component({
  selector: 'ish-cost-center-edit-page',
  templateUrl: './cost-center-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    DirectivesModule,
    LoadingComponent,
    NgIf,
    OrganizationManagementModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
})
export class CostCenterEditPageComponent implements OnInit {
  loading$: Observable<boolean>;
  costCenter$: Observable<CostCenter>;

  form = new UntypedFormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
    this.costCenter$ = this.organizationManagementFacade.selectedCostCenter$;
  }

  submitForm(cc: CostCenter) {
    if (this.form.valid) {
      const formValue = this.form.value;

      const costCenter: CostCenterBase = {
        id: cc.id,
        costCenterId: formValue.costCenterId,
        name: formValue.name,
        budget: { value: formValue.budgetValue, currency: cc.budget.currency, type: 'Money' },
        budgetPeriod: formValue.budgetPeriod,
        costCenterOwner: { login: formValue.costCenterManager },
        active: formValue.active,
      };
      this.organizationManagementFacade.updateCostCenter(costCenter);
    }
  }
}
