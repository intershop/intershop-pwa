import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-create-page',
  templateUrl: './cost-center-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;

  private submitted = false;
  form = new UntypedFormGroup({});

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

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

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
