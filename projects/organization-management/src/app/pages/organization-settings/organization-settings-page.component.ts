import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { pick } from 'lodash-es';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { PriceType } from 'ish-core/models/price/price.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Organization Settings Page Component shows the company profile.
 * The account admin can edit it and change the type (gross / net) for the budget calculation
 */
@Component({
  selector: 'ish-organization-settings-page',
  templateUrl: './organization-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSettingsPageComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private initialBudgetPriceType: PriceType;

  budgetTypeForm: FormGroup = new FormGroup({});
  model: Partial<Customer>;
  fields: FormlyFieldConfig[];
  customer: Customer;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.accountFacade.customer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(currentCustomer => {
      this.customer = currentCustomer;
      this.initialBudgetPriceType = currentCustomer.budgetPriceType;
    });
    this.fields = [
      {
        type: 'ish-budget-type-field',
        key: 'budgetPriceType',
        defaultValue: 'gross',
        props: {
          title: 'account.customer.price_type.label',
          customDescription: 'account.organization.org_settings.preferences.budget_price_type.info',
          options: [
            {
              value: 'gross',
              label: 'account.customer.price_type.gross.label',
            },
            {
              value: 'net',
              label: 'account.customer.price_type.net.label',
            },
          ],
        },
      },
    ];
    this.model = pick(this.customer, 'budgetPriceType');
  }

  resetValue() {
    if (this.initialBudgetPriceType !== this.budgetTypeForm.get('budgetPriceType').value) {
      this.budgetTypeForm
        .get('budgetPriceType')
        .reset({ value: this.initialBudgetPriceType, disabled: false }, { emitEvent: false });
    }
  }

  /**
   * Submits form and throws update event when form is valid
   */
  submit() {
    if (this.budgetTypeForm.invalid) {
      markAsDirtyRecursive(this.budgetTypeForm);
      return;
    }
    const budgetPriceType = this.budgetTypeForm.get('budgetPriceType').value;

    this.accountFacade.updateCustomerProfile(
      { ...this.customer, budgetPriceType },
      { message: 'account.profile.update_company_profile.message' }
    );

    this.initialBudgetPriceType = this.budgetTypeForm.get('budgetPriceType').value;
  }
}
