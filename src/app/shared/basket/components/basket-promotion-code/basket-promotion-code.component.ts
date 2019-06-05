import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  form: FormGroup;

  isCollapsed = true;

  constructor() {
    this.form = new FormGroup({
      codeInput: new FormControl(undefined, [Validators.required, Validators.maxLength(128)]),
    });
  }

  /**
   * Throws addPromotionCode event when add promotion code was clicked.
   */
  submitPromotionCode() {
    this.addPromotionCode.emit(this.form.value.codeInput);
  }
}
