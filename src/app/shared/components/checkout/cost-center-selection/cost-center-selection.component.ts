import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * Assign a cost center for to the basket for business customers
 */
@Component({
  selector: 'ish-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterSelectionComponent implements OnInit, OnDestroy {
  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: { costCenter: string };

  costCenterOptions$: Observable<SelectOption[]>;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    // mark form as dirty to display validation errors
    this.checkoutFacade.basketValidationResults$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      if (results?.errors?.find(error => error.code === 'basket.validation.cost_center_missing.error')) {
        markAsDirtyRecursive(this.form);
      }
    });

    // determine cost center options
    this.costCenterOptions$ = this.accountFacade.isBusinessCustomer$.pipe(
      whenTruthy(),
      take(1),
      switchMap(() => this.checkoutFacade.eligibleCostCenterSelectOptions$())
    );

    // initialize form
    this.costCenterOptions$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(options => {
      if (options.length) {
        this.fields = this.getFields(options);
      }
    });

    // initialize model with the basket costCenter
    this.checkoutFacade.basket$
      .pipe(whenTruthy(), take(1), takeUntil(this.destroy$))
      .subscribe(basket => (this.model = { costCenter: basket.costCenter }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getFields(options: SelectOption[]): FormlyFieldConfig[] {
    return [
      {
        key: 'costCenter',
        type: 'ish-select-field',
        templateOptions: {
          label: 'checkout.cost_center.select.label',
          required: true,
          options,
          placeholder: options.length > 1 ? 'account.option.select.text' : undefined,
        },
        hooks: {
          onInit: field => {
            if (options.length === 1 && options[0].value) {
              this.form.get('costCenter').setValue(options[0].value);
            }
            field.form.valueChanges
              .pipe(
                map(vc => vc.costCenter),
                whenTruthy(),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
              )
              .subscribe(costCenter => {
                this.checkoutFacade.updateBasketCostCenter(costCenter);
              });
          },
        },
      },
    ];
  }
}
