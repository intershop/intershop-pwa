import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'ish-basket-desired-delivery-date',
  templateUrl: './basket-desired-delivery-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketDesiredDeliveryDateComponent implements OnInit, OnChanges {
  @Input() basket: Basket;

  form = new FormGroup({});
  fields: FormlyFieldConfig[];

  model: { desiredDeliveryDate: string };

  showSuccessMessage = false;

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'desiredDeliveryDate',
        type: 'ish-date-picker-field',
        templateOptions: {
          postWrappers: [{ wrapper: 'description', index: -1 }],
          label: 'checkout.desired_delivery_date.label',
          customDescription: {
            key: 'checkout.desired_delivery_date.note',
          },
          minDays: this.checkoutFacade.desiredDeliveryDaysMin$,
          maxDays: this.checkoutFacade.desiredDeliveryDaysMax$,
          isSatExcluded: this.checkoutFacade.isDesiredDeliveryExcludeSaturday$,
          isSunExcluded: this.checkoutFacade.isDesiredDeliveryExcludeSunday$,
          fieldClass: 'col-md-6',
          labelClass: 'col-md-6',
        },
        validators: {
          noSaturday: {
            expression: (control: FormControl, field: FormlyFieldConfig) =>
              field.templateOptions.isSatExcluded ? SpecialValidators.noSaturday(control) : () => true,
            message: 'checkout.desired_delivery_date.error.no_saturday',
          },
          noSunday: {
            expression: (control: FormControl, field: FormlyFieldConfig) =>
              field.templateOptions.isSunExcluded ? SpecialValidators.noSunday(control) : () => true,
            message: 'checkout.desired_delivery_date.error.no_sunday',
          },
        },
        validation: {
          messages: {
            ngbDate: error => {
              if (error.hasOwnProperty('invalid')) {
                return 'checkout.desired_delivery_date.error.date';
              }
              if (error.hasOwnProperty('minDate')) {
                return 'checkout.desired_delivery_date.error.min_date';
              }
              if (error.hasOwnProperty('maxDate')) {
                return 'checkout.desired_delivery_date.error.max_date';
              }
              return;
            },
          },
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    // we only care about the ddd, so only do anything if it has changed
    if (
      this.getDesiredDeliveryDate(changes.basket?.previousValue) !==
      this.getDesiredDeliveryDate(changes.basket?.currentValue)
    ) {
      if (!changes.basket.isFirstChange()) {
        this.displaySuccessMessage();
      }
      this.model = {
        ...this.model,
        desiredDeliveryDate: this.getDesiredDeliveryDate(this.basket),
      };
    }
  }

  private getDesiredDeliveryDate(basket: Basket): string | undefined {
    return basket?.attributes?.find(attr => attr.name === 'desiredDeliveryDate')?.value as string | undefined;
  }

  private displaySuccessMessage() {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.cd.markForCheck();
    }, 5000);
  }
  get disabled() {
    return (
      this.form.invalid || (!this.getDesiredDeliveryDate(this.basket) && !this.form.get('desiredDeliveryDate').value)
    );
  }

  submitForm() {
    if (this.disabled) {
      return;
    }

    const desiredDeliveryDate = this.form.get('desiredDeliveryDate').value;

    this.checkoutFacade.setBasketCustomAttribute({
      name: 'desiredDeliveryDate',
      value: desiredDeliveryDate ? desiredDeliveryDate : '',
    });
  }
}
