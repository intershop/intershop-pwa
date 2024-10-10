import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-edit-page',
  templateUrl: './cost-center-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterEditPageComponent implements OnInit {
  loading$: Observable<boolean>;
  costCenter$: Observable<CostCenter>;

  private submitted = false;
  form = new UntypedFormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
    this.costCenter$ = this.organizationManagementFacade.selectedCostCenter$;
  }

  submitForm(cc: CostCenter) {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

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

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
