import { NgIf } from '@angular/common';
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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { SuccessMessageComponent } from 'ish-shared/components/common/success-message/success-message.component';

/**
 * The Basket Merchant Message Component displays a message to merchant input.
 * It provides the add message to merchant functionality.
 *
 */
@Component({
  selector: 'ish-basket-merchant-message',
  templateUrl: './basket-merchant-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, SuccessMessageComponent, TranslatePipe, FormlyForm],
})
export class BasketMerchantMessageComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;

  form = new FormGroup({});
  model: { messageToMerchant: string } = { messageToMerchant: '' };
  fields: FormlyFieldConfig[];
  showSuccessMessage = false;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private cd: ChangeDetectorRef
  ) {}

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
    this.checkoutFacade.setBasketMessageToMerchant(this.form.get('messageToMerchant')?.value);
  }
}
