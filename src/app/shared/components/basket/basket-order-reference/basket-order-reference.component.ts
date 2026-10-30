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
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'ish-basket-order-reference',
  standalone: false,
  templateUrl: './basket-order-reference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketOrderReferenceComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;

  form = new FormGroup({});
  model: { orderReferenceId: string } = { orderReferenceId: '' };
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

  ngOnChanges(changes: SimpleChanges<BasketOrderReferenceComponent>) {
    if (this.basket) {
      this.successMessage(changes.basket);
      this.model = { ...this.model, orderReferenceId: this.basket.externalOrderReference };
    }
  }

  private successMessage(basketChange: SimpleChange<Basket>) {
    if (
      basketChange?.previousValue?.externalOrderReference !== basketChange?.currentValue?.externalOrderReference &&
      !basketChange?.firstChange
    ) {
      this.successMessageTrigger$.next();
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
