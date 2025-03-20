import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

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
export class BasketCostCenterSelectionComponent implements OnInit {
  form: FormGroup;

  costCenterOptions$: Observable<SelectOption[]>;
  selectedCostCenter: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.costCenterOptions$ = this.accountFacade.isBusinessCustomer$.pipe(
      whenTruthy(),
      switchMap(() => this.checkoutFacade.eligibleCostCenterSelectOptions$())
    );

    // initialize model with the basket costCenter
    this.checkoutFacade.basket$
      .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(basket => this.setupForm(basket.costCenter));

    // mark form as dirty to display validation errors
    this.checkoutFacade.basketValidationResults$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(results => {
      if (
        !results?.valid &&
        results?.errors?.find(error => error.code === 'basket.validation.cost_center_missing.error')
      ) {
        markAsDirtyRecursive(this.form);
        this.cd.markForCheck();
      }
    });

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
  }

  private setupForm(costCenter: string) {
    this.form = this.fb.group({
      costCenter: [costCenter],
    });
  }
}
