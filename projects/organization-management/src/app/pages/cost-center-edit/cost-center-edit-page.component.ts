import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-edit-page',
  templateUrl: './cost-center-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
