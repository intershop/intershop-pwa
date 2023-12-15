import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Basket Promotion Component displays a promotion code input.
 * It provides the add promotion code functionality
 *
 * @example
 * <ish-basket-promotion-code></ish-basket-promotion-code>
 */
@Component({
  selector: 'ish-basket-promotion-code',
  templateUrl: './basket-promotion-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionCodeComponent implements OnInit {
  @Input() toast = true;

  basket$: Observable<BasketView>;
  promotionError$: Observable<HttpError>;
  codeInput: FormControl;
  isCollapsed = true;
  codeMaxLength = 128;

  basketPromoCodes: string[];
  lastEnteredPromoCode = '';

  private destroyRef = inject(DestroyRef);

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.promotionError$ = this.checkoutFacade.promotionError$;

    this.codeInput = new FormControl('', [Validators.required, Validators.maxLength(this.codeMaxLength)]);

    // update emitted to display spinning animation
    this.basket$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(basket => {
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
    if (!this.basketPromoCodes?.includes(this.codeInput.value)) {
      this.lastEnteredPromoCode = this.codeInput.value;
    }
    this.checkoutFacade.addPromotionCodeToBasket(this.codeInput.value);
    // prevent further form submit
    return false;
  }
  get displaySuccessMessage(): boolean {
    return this.basketPromoCodes?.includes(this.lastEnteredPromoCode);
  }
}
