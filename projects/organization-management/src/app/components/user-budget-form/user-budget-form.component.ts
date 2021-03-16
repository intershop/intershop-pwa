import { getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

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
export class UserBudgetFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() budget?: UserBudget;

  fields: FormlyFieldConfig[];
  model: UserBudgetModel;

  currentLocale: Locale;

  periods = ['weekly', 'monthly', 'quarterly'];

  private destroy$ = new Subject();

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for UserBudgetFormComponent');
    }

    // determine current locale
    this.appFacade.currentLocale$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locale => {
      this.currentLocale = locale;
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

    model.currency = budget?.remainingBudget?.currency || this.currentLocale.currency;
    model.budgetPeriod =
      !budget?.budgetPeriod || budget?.budgetPeriod === 'none' ? this.periods[0] : budget.budgetPeriod;

    return model;
  }

  private getFields() {
    return [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'currency',
            type: 'ish-text-input-field',
            templateOptions: {
              fieldClass: 'd-none',
              required: true,
            },
          },
          {
            key: 'orderSpentLimitValue',
            type: 'ish-text-input-field',
            templateOptions: {
              postWrappers: ['input-addon'],
              label: 'account.user.new.order_spend_limit.label',
              addonLeft: {
                text: getCurrencySymbol(this.model.currency, 'wide', this.currentLocale.lang),
              },
            },
            validators: {
              validation: [SpecialValidators.moneyAmount],
            },
            validation: {
              messages: {
                moneyAmount: 'account.user.new.OrderLimit.error.valid',
              },
            },
          },
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'col-8',
                key: 'budgetValue',
                type: 'ish-text-input-field',
                templateOptions: {
                  postWrappers: ['input-addon'],
                  labelClass: 'col-md-6',
                  fieldClass: 'col-md-6 pr-0',
                  label: 'account.user.budget.label',
                  addonLeft: {
                    text: getCurrencySymbol(this.model.currency, 'wide', this.currentLocale.lang),
                  },
                },
                validators: {
                  validation: [SpecialValidators.moneyAmount],
                },
                validation: {
                  messages: {
                    moneyAmount: 'account.user.new.Budget.error.valid',
                  },
                },
              },
              {
                className: 'col-4',
                type: 'ish-select-field',
                key: 'budgetPeriod',
                templateOptions: {
                  fieldClass: 'col-12 formly-empty-label',
                  options: this.periods.map(period => ({
                    value: period,
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
