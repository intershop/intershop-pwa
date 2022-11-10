import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { Basket } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'ish-basket-merchant-message',
  templateUrl: './basket-merchant-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketMerchantMessageComponent implements OnInit {
  @Input() basket: Basket;

  form = new FormGroup({});
  model: { messageToMerchant: string } = { messageToMerchant: '' };
  fields: FormlyFieldConfig[];
  showSuccessMessage = false;

  ngOnInit() {
    this.fields = [
      {
        key: 'basket_merchant_message',
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
}
