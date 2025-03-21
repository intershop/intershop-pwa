import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take, withLatestFrom } from 'rxjs/operators';

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

  bufferSize = 25;
  itemsBeforeFetchingMore = 5;
  costCenterOptions: SelectOption[];
  costCenterOptionsBuffer: SelectOption[];

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({ costCenter: [undefined] });

    combineLatest([
      this.accountFacade.isBusinessCustomer$.pipe(whenTruthy()),
      this.checkoutFacade.eligibleCostCenterSelectOptions$(),
      this.checkoutFacade.basket$.pipe(whenTruthy(), take(1)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([_, costCenterOptions, basket]) => {
        this.costCenterOptions = costCenterOptions;
        this.costCenterOptionsBuffer = this.costCenterOptions.slice(0, this.bufferSize);
        this.setupForm(basket.costCenter);
        this.cd.markForCheck();
      });

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

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll(end: number) {
    if (this.costCenterOptions.length <= this.costCenterOptionsBuffer.length) {
      return;
    }

    if (end + this.itemsBeforeFetchingMore >= this.costCenterOptionsBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const length = this.costCenterOptionsBuffer.length;
    const additionalCostCenters = this.costCenterOptions.slice(length, this.bufferSize + length);
    this.costCenterOptions.concat(additionalCostCenters);
  }

  private setupForm(costCenter: string) {
    const defaultOption =
      costCenter || (this.costCenterOptions.length === 1 ? this.costCenterOptions[0].value : undefined);
    this.form.patchValue({ costCenter: defaultOption });
  }
}
