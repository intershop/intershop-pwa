import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { pick } from 'lodash-es';
import { take } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-organization-settings-page',
  templateUrl: './organization-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSettingsPageComponent implements OnInit {
  modelChanges = true;
  private destroyRef = inject(DestroyRef);

  budgetTypeForm = new FormGroup({});
  model: Partial<Customer>;
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions = {};
  customer: Customer;

  constructor(private accountFacade: AccountFacade, private fieldLibrary: FieldLibrary) {}

  ngOnInit() {
    this.accountFacade.customer$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(currentCustomer => {
      this.customer = currentCustomer;
    });
    this.fields = [this.fieldLibrary.getConfiguration('budgetPriceType')];
    this.model = pick(this.customer, 'budgetPriceType');
  }

  cleanUp() {
    this.modelChanges = true;
  }

  resetValues() {
    this.options.resetModel();
    this.modelChanges = false;
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.budgetTypeForm.invalid) {
      this.modelChanges = true;
      markAsDirtyRecursive(this.budgetTypeForm);
      return;
    }
    const budgetPriceType = this.budgetTypeForm.get('budgetPriceType').value;

    this.accountFacade.updateCustomerProfile(
      { ...this.customer, budgetPriceType },
      { message: 'account.profile.update_company_profile.message' }
    );
  }
}
