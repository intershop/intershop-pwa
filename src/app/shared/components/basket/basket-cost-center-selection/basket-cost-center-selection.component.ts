import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * Assign a cost center for to the basket for business customers
 */
@Component({
  selector: 'ish-basket-cost-center-selection',
  templateUrl: './basket-cost-center-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostCenterSelectionComponent implements OnInit {
  form = new UntypedFormGroup({});
  fields$: Observable<FormlyFieldConfig[]>;
  model: { costCenter: string };

  private costCenterOptions$: Observable<SelectOption[]>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.costCenterOptions$ = this.accountFacade.isBusinessCustomer$.pipe(
      whenTruthy(),
      switchMap(() => this.checkoutFacade.eligibleCostCenterSelectOptions$())
    );

    this.fields$ = combineLatest([
      this.costCenterOptions$,
      // retrigger field render when cost center is updated (maybe we don't need the placeholder anymore)
      this.checkoutFacade.basket$.pipe(
        map(basket => basket?.costCenter),
        distinctUntilChanged()
      ),
    ]).pipe(
      map(([options]) => options),
      map(options => (options.length ? this.getFields(options) : undefined)),
      whenTruthy()
    );

    // initialize model with the basket costCenter
    this.checkoutFacade.basket$
      .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(basket => (this.model = { costCenter: basket.costCenter }));

    // save changes after form value changed
    this.form.valueChanges
      .pipe(
        whenTruthy(),
        map(val => val.costCenter),
        distinctUntilChanged(),
        withLatestFrom(this.checkoutFacade.basket$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([costCenter, basket]) => {
        if (costCenter !== basket.costCenter && !!costCenter) {
          this.checkoutFacade.updateBasketCostCenter(costCenter);
        }
      });

    // mark form as dirty to display validation errors
    this.checkoutFacade.basketValidationResults$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(results => {
      if (
        !results?.valid &&
        results?.errors?.find(error => error.code === 'basket.validation.cost_center_missing.error')
      ) {
        markAsDirtyRecursive(this.form);
        focusFirstInvalidField(this.form);
        this.cd.markForCheck();
      }
    });
  }
  private getFields(options: SelectOption[]): FormlyFieldConfig[] {
    if (options.length === 1 && options[0].value && !this.model?.costCenter) {
      this.model = { ...this.model, costCenter: options[0].value };
    }
    return [
      {
        key: 'costCenter',
        type: 'ish-select-field',
        props: {
          label: 'checkout.cost_center.select.label',
          required: true,
          hideRequiredMarker: true,
          options,
          placeholder: options.length > 1 && !this.model?.costCenter ? 'account.option.select.text' : undefined,
        },
      },
    ];
  }
}
