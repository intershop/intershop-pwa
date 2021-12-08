import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * Assign a cost center for to the basket for business customers
 */
@Component({
  selector: 'ish-basket-cost-center-selection',
  templateUrl: './basket-cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostCenterSelectionComponent implements OnInit, OnDestroy {
  form = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: { costCenter: string };

  costCenterOptions$: Observable<SelectOption[]>;

  private destroy$ = new Subject();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // mark form as dirty to display validation errors
    this.checkoutFacade.basketValidationResults$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      if (
        !results?.valid &&
        results?.errors?.find(error => error.code === 'basket.validation.cost_center_missing.error')
      ) {
        markAsDirtyRecursive(this.form);
        this.cd.markForCheck();
      }
    });

    // determine cost center options
    this.costCenterOptions$ = this.accountFacade.isBusinessCustomer$.pipe(
      whenTruthy(),
      take(1),
      switchMap(() => this.checkoutFacade.eligibleCostCenterSelectOptions$()),
      shareReplay(1)
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

    // save changes after form value changed
    this.form.valueChanges
      .pipe(
        whenTruthy(),
        map(val => val.costCenter),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(costCenter => {
        this.checkoutFacade.updateBasketCostCenter(costCenter);
      });
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
          hideRequiredMarker: true,
          options,
          placeholder: options.length > 1 && !this.model?.costCenter ? 'account.option.select.text' : undefined,
        },
        hooks: {
          // set automatically a cost center at basket if there is only 1 cost center assigned to this user
          onInit: () => {
            if (options.length === 1 && options[0].value && !this.model?.costCenter) {
              this.form.get('costCenter').setValue(options[0].value);
            }
          },
        },
      },
    ];
  }
}
