import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { FormsService } from 'ish-shared/forms/utils/forms.service';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-form',
  templateUrl: './cost-center-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() costCenter: CostCenter;

  fields$: Observable<FormlyFieldConfig[]>;
  model$: Observable<{ budgetValue?: number; currency: string; costCenterManager?: string } & Partial<CostCenterBase>>;

  error$: Observable<HttpError>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for CostCenterFormComponent');
    }

    const currencyAndManagerOptions$ = combineLatest([
      this.appFacade.currentCurrency$.pipe(whenTruthy()),
      this.organizationManagementFacade.costCenterManagerSelectOptions$(),
    ]);

    this.model$ = currencyAndManagerOptions$.pipe(
      map(([currency, options]) => this.getModel(currency, options[0].value))
    );

    this.fields$ = currencyAndManagerOptions$.pipe(map(([currency, options]) => this.getFields(currency, options)));

    this.error$ = this.organizationManagementFacade.costCentersError$;
  }

  private getModel(currentCurrency: string, defaultManagerLogin: string) {
    return this.costCenter
      ? {
          ...this.costCenter,
          currency: this.costCenter.budget?.currency,
          budgetValue: this.costCenter.budget.value,
          budgetPeriod: this.costCenter.budgetPeriod,
          costCenterManager: this.costCenter?.costCenterOwner?.login,
        }
      : {
          costCenterManager: defaultManagerLogin,
          currency: currentCurrency,
          budgetPeriod: 'fixed',
          active: true,
        };
  }

  private getFields(currentCurrency: string, managerOptions: { label: string; value: string }[]) {
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
            key: 'costCenterId',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.costcenter.id.label',
              required: true,
              hideRequiredMarker: true,
              readonly: !!(this.costCenter?.pendingOrders + this.costCenter?.approvedOrders),
            },
            validators: {
              validation: [SpecialValidators.noSpecialChars],
            },
            validation: {
              messages: {
                required: 'account.costcenter.id.error.required',
                noSpecialChars: 'account.name.error.forbidden.chars',
              },
            },
          },
          {
            key: 'name',
            type: 'ish-text-input-field',
            templateOptions: {
              label: 'account.costcenter.name.label',
              required: true,
              hideRequiredMarker: true,
            },
            validation: {
              messages: {
                required: 'account.costcenter.name.error.required',
              },
            },
          },
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'col-6 col-md-8',
                key: 'budgetValue',
                type: 'ish-text-input-field',
                templateOptions: {
                  postWrappers: [{ wrapper: 'input-addon', index: -1 }],
                  labelClass: 'col-md-6',
                  fieldClass: 'col-md-6 pr-0',
                  label: 'account.costcenter.budget.label',
                  required: true,
                  hideRequiredMarker: true,
                  addonLeft: {
                    text: this.appFacade.currencySymbol$(currentCurrency),
                  },
                },
                validators: {
                  validation: [SpecialValidators.moneyAmount],
                },
                validation: {
                  messages: {
                    moneyAmount: 'account.costcenter.budget.error.valid',
                    required: 'account.costcenter.budget.error.required',
                  },
                },
              },
              {
                className: 'col-6 col-md-4',
                type: 'ish-select-field',
                key: 'budgetPeriod',
                templateOptions: {
                  fieldClass: 'col-12 label-empty',
                  options: FormsService.getCostCenterBudgetPeriodOptions(),
                },
              },
            ],
          },
          {
            key: 'costCenterManager',
            type: 'ish-select-field',
            templateOptions: {
              label: 'account.costcenter.manager.label',
              required: true,
              hideRequiredMarker: true,
              options: managerOptions,
            },
            validation: {
              messages: {
                required: 'account.costcenter.manager.error.required',
              },
            },
          },
        ],
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
          // hide active flag for new cost centers
          fieldsetClass: !this.costCenter ? 'd-none' : undefined,
        },
        fieldGroup: [
          {
            key: 'active',
            type: 'ish-checkbox-field',
            templateOptions: {
              label: 'account.costCenter.active.label',
            },
          },
        ],
      },
    ];
  }
}
