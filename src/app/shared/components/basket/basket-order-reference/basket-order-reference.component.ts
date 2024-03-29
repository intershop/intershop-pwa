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
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'ish-basket-order-reference',
  templateUrl: './basket-order-reference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketOrderReferenceComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;

  form = new FormGroup({});
  model: { orderReferenceId: string } = { orderReferenceId: '' };
  fields: FormlyFieldConfig[];

  showSuccessMessage = false;

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'orderReferenceId',
        type: 'ish-text-input-field',
        props: {
          postWrappers: [{ wrapper: 'description', index: -1 }],
          label: 'checkout.orderReferenceId.label',
          maxLength: 35,
          customDescription: {
            key: 'checkout.orderReferenceId.note',
          },
          labelClass: 'col-md-6',
          fieldClass: 'col-md-6',
        },
        validators: {
          validation: [SpecialValidators.noSpecialChars],
        },
        validation: {
          messages: {
            noSpecialChars: 'account.name.error.forbidden.chars',
          },
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.basket) {
      this.successMessage(changes.basket);
      this.model = { ...this.model, orderReferenceId: this.basket.externalOrderReference };
    }
  }

  private successMessage(basketChange: SimpleChange) {
    if (
      (basketChange?.previousValue as Basket)?.externalOrderReference !==
        (basketChange?.currentValue as Basket)?.externalOrderReference &&
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
    return this.form.invalid || (!this.basket?.externalOrderReference && !this.form.get('orderReferenceId').value);
  }

  submitForm() {
    if (this.disabled) {
      return;
    }
    this.checkoutFacade.updateBasketExternalOrderReference(this.form.get('orderReferenceId').value);
  }
}
