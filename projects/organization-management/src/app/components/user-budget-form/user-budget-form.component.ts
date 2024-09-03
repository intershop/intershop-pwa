import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AppFacade } from 'ish-core/facades/app.facade';
import { whenTruthy } from 'ish-core/utils/operators';

import { UserBudget } from '../../models/user-budget/user-budget.model';

interface UserBudgetModel {
  orderSpentLimitValue?: number;
  budgetValue?: number;
  budgetPeriod?: string;
  currency?: string;
}

@Component({
  selector: 'ish-user-budget-form',
  templateUrl: './user-budget-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserBudgetFormComponent implements OnInit {
  @Input({ required: true }) form: FormGroup;
  @Input() budget: UserBudget;

  fields: FormlyFieldConfig[];
  model: UserBudgetModel;

  private currentCurrency: string;

  private periods = ['weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'];

  private destroyRef = inject(DestroyRef);

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for UserBudgetFormComponent');
    }

    // determine current currency
    this.appFacade.currentCurrency$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(currency => {
      this.currentCurrency = currency;
    });

    this.model = this.getModel(this.budget);
    this.fields = this.getFields();
  }

  private getModel(budget: UserBudget) {
    const model: UserBudgetModel = {};

    if (budget) {
      model.orderSpentLimitValue = budget.orderSpentLimit?.value;
      model.budgetValue = budget.budget?.value;
    }

    model.currency = budget?.remainingBudget?.currency || this.currentCurrency;
    model.budgetPeriod =
      !budget?.budgetPeriod || budget?.budgetPeriod === 'none' ? this.periods[0] : budget.budgetPeriod;

    return model;
  }

  private getFields() {
    return [
      {
        type: 'ish-fieldset-field',
        props: {
          legend: 'account.user.update_budget.heading',
          legendClass: 'legend-invisible',
        },
        fieldGroup: [
          {
            key: 'currency',
            type: 'ish-text-input-field',
            props: {
              fieldClass: 'd-none',
              required: true,
            },
          },
          {
            key: 'orderSpentLimitValue',
            type: 'ish-text-input-field',
            props: {
              postWrappers: [{ wrapper: 'input-addon', index: -1 }],
              label: 'account.user.new.order_spend_limit.label',
              placeholder: 'account.budget.unlimited',
              addonLeft: {
                text: this.appFacade.currencySymbol$(this.model.currency),
              },
              mask: 'separator.2',
            },
          },
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'col-8',
                key: 'budgetValue',
                type: 'ish-text-input-field',
                props: {
                  postWrappers: [{ wrapper: 'input-addon', index: -1 }],
                  labelClass: 'col-md-6',
                  fieldClass: 'col-md-6 pr-0',
                  label: 'account.user.budget.label',
                  placeholder: 'account.budget.unlimited',
                  addonLeft: {
                    text: this.appFacade.currencySymbol$(this.model.currency),
                  },
                  mask: 'separator.2',
                },
              },
              {
                className: 'col-4',
                type: 'ish-select-field',
                key: 'budgetPeriod',
                props: {
                  fieldClass: 'col-12 label-empty',
                  options: this.periods.map(period => ({
                    value: period,
                    // keep-localization-pattern: ^account\.user\.new\.budget\.period\.value.*
                    label: `account.user.new.budget.period.value.${period}`,
                  })),
                },
              },
            ],
          },
        ],
      },
    ];
  }
}
