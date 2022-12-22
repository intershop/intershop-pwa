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
    return !this.basket?.messageToMerchant && !this.form.get('messageToMerchant')?.value;
  }

  submitForm(): void {
    if (this.disabled) {
      return;
    }
    if (!this.form.get('messageToMerchant')?.value) {
      // TODO : Delete message to merchant (waits for the rest api)
      return;
    }
    this.checkoutFacade.setBasketMessageToMerchant(this.form.get('messageToMerchant')?.value);
  }
}
