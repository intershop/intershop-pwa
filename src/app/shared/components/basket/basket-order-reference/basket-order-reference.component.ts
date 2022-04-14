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
  @Input() basket: Basket;

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
        templateOptions: {
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
      this.model = { ...this.model, orderReferenceId: this.getOrderReferenceId(this.basket) };
    }
  }

  private getOrderReferenceId(basket: Basket): string {
    return basket?.attributes?.find(attr => attr.name === 'orderReferenceID')?.value as string;
  }

  private successMessage(basketChange: SimpleChange) {
    if (
      this.getOrderReferenceId(basketChange?.previousValue) !== this.getOrderReferenceId(basketChange?.currentValue) &&
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
    return this.form.invalid || (!this.getOrderReferenceId(this.basket) && !this.form.get('orderReferenceId').value);
  }

  submitForm() {
    if (this.disabled) {
      return;
    }
    this.checkoutFacade.setBasketCustomAttribute({
      name: 'orderReferenceID',
      value: this.form.get('orderReferenceId').value,
    });
  }
}
