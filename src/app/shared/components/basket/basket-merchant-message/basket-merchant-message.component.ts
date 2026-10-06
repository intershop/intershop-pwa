import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, map, startWith, switchMap, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';

/**
 * The Basket Merchant Message Component displays a message to merchant input.
 * It provides the add message to merchant functionality.
 *
 */
@Component({
  selector: 'ish-basket-merchant-message',
  standalone: false,
  templateUrl: './basket-merchant-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketMerchantMessageComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;

  form = new FormGroup({});
  model: { messageToMerchant: string } = { messageToMerchant: '' };
  fields: FormlyFieldConfig[];

  private successMessageTrigger$ = new Subject<void>();
  showSuccessMessage$ = this.successMessageTrigger$.pipe(
    switchMap(() =>
      timer(5000).pipe(
        map(() => false),
        startWith(true)
      )
    )
  );

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'messageToMerchant',
        type: 'ish-textarea-field',
        props: {
          label: 'checkout.basket_merchant_message.label',
          maxLength: 1000,
          rows: 2,
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges<BasketMerchantMessageComponent>) {
    if (this.basket) {
      this.successMessage(changes.basket);
      this.model = {
        ...this.model,
        messageToMerchant: this.basket?.messageToMerchant ? this.basket?.messageToMerchant : '',
      };
    }
  }

  private successMessage(basketChange: SimpleChange<Basket>) {
    if (
      basketChange?.previousValue?.messageToMerchant !== basketChange?.currentValue?.messageToMerchant &&
      !basketChange?.firstChange
    ) {
      this.successMessageTrigger$.next();
    }
  }

  get disabled() {
    return !this.basket?.messageToMerchant && !this.form.get('messageToMerchant')?.value;
  }

  submitForm(): void {
    this.checkoutFacade.setBasketMessageToMerchant(this.form.get('messageToMerchant')?.value);
  }
}
