import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';

/**
 * The Basket Merchant Message Component displays a message to merchant input.
 * It provides the add message to merchant functionality.
 *
 * @example
 * <ish-basket-merchant-message></ish-basket-merchant-message>
 */
@Component({
  selector: 'ish-basket-merchant-message',
  templateUrl: './basket-merchant-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketMerchantMessageComponent implements OnInit, OnChanges {
  @Input() basket: Basket;

  form = new FormGroup({});
  model: { messageToMerchant: string } = { messageToMerchant: '' };
  fields: FormlyFieldConfig[];
  showSuccessMessage = false;

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'messageToMerchant',
        type: 'ish-textarea-field',
        templateOptions: {
          postWrappers: [{ wrapper: 'description', index: -1 }],
          label: 'checkout.basket_merchant_message.label',
          maxLength: 3000,
          rows: 2,
          labelClass: 'col-md-12',
          fieldClass: 'col-md-12',
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.basket) {
      this.successMessage(changes.basket);
      this.model = {
        ...this.model,
        messageToMerchant: this.basket?.messageToMerchant ? this.basket?.messageToMerchant : '',
      };
    }
  }

  private successMessage(basketChange: SimpleChange) {
    if (
      basketChange?.previousValue?.messageToMerchant !== basketChange?.currentValue?.messageToMerchant &&
      !basketChange?.firstChange
    ) {
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.cd.markForCheck();
      }, 5000);
    }
  }

  get disabled() {
    /* TODO : Delete message to merchant is not possible for the user yet ( REST API responds with a 500 error and an error page is shown )
      ICM 7.10.39.2 or higher is required to fix this issue (AB#82589), uncomment the following line in this case
    return !this.basket?.messageToMerchant && !this.form.get('messageToMerchant')?.value; */
    return !this.model.messageToMerchant.trim();
  }

  submitForm(): void {
    this.checkoutFacade.setBasketMessageToMerchant(this.form.get('messageToMerchant')?.value);
  }
}
