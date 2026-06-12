import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-create-page',
  templateUrl: './cost-center-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
