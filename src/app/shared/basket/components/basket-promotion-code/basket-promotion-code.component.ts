// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import { getBasketPromotionError, getBasketPromotionSuccess } from 'ish-core/store/checkout/basket';

/**
 * The Basket Promotion Component displays a promotion code input.
 * It provides the add promotion code functionality
 *
 * @example
 * <ish-basket-promotion-code
 *   [code]="code"
 *   (addPromotionCode)="onAddPromotionCode($event)"
 * ></ish-basket-promotion-code>
 */
@Component({
  selector: 'ish-basket-promotion-code',
  templateUrl: './basket-promotion-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPromotionCodeComponent {
  @Input() code: string;
  @Output() addPromotionCode = new EventEmitter<string>();
  codeInput: FormControl = new FormControl('', [Validators.required, Validators.maxLength(128)]);
  isCollapsed = true;
  promotionError$ = this.store.pipe(select(getBasketPromotionError));
  promotionSuccess$ = this.store.pipe(select(getBasketPromotionSuccess));

  constructor(private store: Store<{}>) {}

  /**
   * Throws addPromotionCode event when add promotion code was clicked.
   */
  submitPromotionCode() {
    this.addPromotionCode.emit(this.codeInput.value);
  }
}
