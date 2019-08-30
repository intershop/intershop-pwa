// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AddPromotionCodeToBasket, getBasketPromotionError, getCurrentBasket } from 'ish-core/store/checkout/basket';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Basket Promotion Component displays a promotion code input.
 * It provides the add promotion code functionality
 *
 * @example
 * <ish-basket-promotion-code ></ish-basket-promotion-code>
 */
@Component({
  selector: 'ish-basket-promotion-code',
  templateUrl: './basket-promotion-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionCodeComponent implements OnInit, OnDestroy {
  basket$ = this.store.pipe(select(getCurrentBasket));
  promotionError$ = this.store.pipe(select(getBasketPromotionError));

  codeInput: FormControl;
  isCollapsed = true;
  codeMaxLength = 128;

  basketPromoCodes: string[];
  lastEnteredPromoCode = '';

  private destroy$ = new Subject();

  constructor(private store: Store<{}>, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.codeInput = new FormControl('', [Validators.required, Validators.maxLength(this.codeMaxLength)]);

    // update emitted to display spinning animation
    this.basket$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(basket => {
        this.basketPromoCodes = basket.promotionCodes;
        if (this.displaySuccessMessage) {
          this.codeInput.reset();
          this.isCollapsed = true;
        }
        this.cd.detectChanges();
      });
  }

  /**
   * submit promotion code when add promotion code was clicked.
   */
  submitPromotionCode() {
    // prevent success message if the user enters the same promo code twice
    if (!this.basketPromoCodes || !this.basketPromoCodes.includes(this.codeInput.value)) {
      this.lastEnteredPromoCode = this.codeInput.value;
    }
    this.store.dispatch(new AddPromotionCodeToBasket({ code: this.codeInput.value }));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get displaySuccessMessage(): boolean {
    return this.basketPromoCodes && this.basketPromoCodes.includes(this.lastEnteredPromoCode);
  }
}
