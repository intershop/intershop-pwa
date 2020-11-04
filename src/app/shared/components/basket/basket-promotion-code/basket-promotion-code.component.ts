import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
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
  @Input() toast = true;

  basket$: Observable<BasketView>;
  promotionError$: Observable<HttpError>;
  codeInput: FormControl;
  isCollapsed = true;
  codeMaxLength = 128;

  basketPromoCodes: string[];
  lastEnteredPromoCode = '';

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.promotionError$ = this.checkoutFacade.promotionError$;

    this.codeInput = new FormControl('', [Validators.required, Validators.maxLength(this.codeMaxLength)]);

    // update emitted to display spinning animation
    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(basket => {
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
    this.checkoutFacade.addPromotionCodeToBasket(this.codeInput.value);
    // prevent further form submit
    return false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get displaySuccessMessage(): boolean {
    return this.basketPromoCodes && this.basketPromoCodes.includes(this.lastEnteredPromoCode);
  }
}
