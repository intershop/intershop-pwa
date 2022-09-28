import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, merge } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { FormsService } from 'ish-shared/forms/utils/forms.service';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

/**
 * The Cost Center Buyers Page Component displays all the users that are not yet assigned to this cost center. The user can enter user budgets and add these users to the cost center.
 *
 */
@Component({
  selector: 'ish-cost-center-buyers-page',
  templateUrl: './cost-center-buyers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterBuyersPageComponent implements OnDestroy, OnInit {
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  buyers$: Observable<B2bUser[]>;

  form: FormGroup = new FormGroup({});
  submitted = false;

  fields: FormlyFieldConfig[];
  model: {
    addBuyers: {
      selected: boolean;
      name: string;
      login: string;
      budgetValue: number;
      currency: string;
      budgetPeriod: string;
    }[];
  } = {
    addBuyers: [],
  };

  selectAll = true;

  private destroy$ = new Subject<void>();

  constructor(
    private appFacade: AppFacade,
    private organizationManagementFacade: OrganizationManagementFacade,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
    this.error$ = merge(
      this.organizationManagementFacade.costCentersError$,
      this.organizationManagementFacade.usersError$
    );
    this.buyers$ = this.organizationManagementFacade.costCenterUnassignedBuyers$();
    // set model and form fields
    this.buyers$
      .pipe(withLatestFrom(this.appFacade.currentCurrency$), take(1), takeUntil(this.destroy$))
      .subscribe(([buyers, currency]) => {
        this.model = this.getModel(buyers, currency);
        this.fields = this.getFields();
      });
  }

  getModel(buyers: B2bUser[], currency: string) {
    const inactivetext = this.translateService.instant('account.user.list.status.inactive');
    return {
      addBuyers: buyers.map(buyer => ({
        selected: false,
        name: `${buyer.firstName} ${buyer.lastName} ${
          !buyer.active ? `<p class="input-help">${inactivetext}</p>` : ''
        } `,
        login: buyer.login,
        budgetValue: undefined,
        currency,
        budgetPeriod: FormsService.getCostCenterBudgetPeriodOptions()[0].value,
      })),
    };
  }

  getFields() {
    return [
      {
        key: 'addBuyers',
        type: 'repeatCostCenterBuyers',
        templateOptions: {},
        fieldArray: {
          fieldGroupClassName: 'row list-item-row',
          fieldGroup: [
            {
              type: 'ish-checkbox-field',
              key: 'selected',
              defaultValue: false,
              className: 'col-1 col-md-2 list-item pb-0',
              templateOptions: {
                fieldClass: 'offset-md-2 col-2 mt-1',
              },
            },
            {
              key: 'name',
              type: 'ish-html-text-field',
              className: 'col-11 col-sm-10 col-md-3 list-item pb-0',
              templateOptions: {
                inputClass: 'col-form-label pb-0',
              },
            },
            {
              key: 'budgetValue',
              type: 'ish-text-input-field',
              className: 'col-6 col-md-4 list-item',
              templateOptions: {
                fieldClass: 'col-12',
                postWrappers: [{ wrapper: 'input-addon', index: -1 }],
                addonLeft: {
                  text: this.appFacade.currencySymbol$(),
                },
              },
              validators: {
                validation: [SpecialValidators.moneyAmount],
              },
              validation: {
                messages: {
                  moneyAmount: 'account.costcenter.budget.error.valid',
                },
              },
            },
            {
              key: 'budgetPeriod',
              type: 'ish-select-field',
              className: 'col-6 col-md-3 list-item',
              templateOptions: {
                fieldClass: 'col-12',
                options: FormsService.getCostCenterBudgetPeriodOptions(),
              },
            },
          ],
        },
      },
    ];
  }

  toggleItemSelection() {
    this.model = {
      addBuyers: this.model.addBuyers.map(line => ({
        ...line,
        selected: this.selectAll,
      })),
    };
    this.form.updateValueAndValidity();
    this.selectAll = !this.selectAll;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
    const buyers: CostCenterBuyer[] = this.model.addBuyers
      .map(item =>
        item.selected
          ? {
              login: item.login,
              budget: PriceHelper.getPrice(item.currency, item.budgetValue || 0),
              budgetPeriod: item.budgetPeriod,
            }
          : undefined
      )
      .filter(item => item !== undefined);
    this.organizationManagementFacade.addBuyersToCostCenter(buyers);
  }

  get formDisabled() {
    return (this.form.invalid && this.submitted) || !this.model.addBuyers.some(buyer => buyer.selected);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
