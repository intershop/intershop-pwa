import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isEqual, parseISO } from 'date-fns';
import { Subject, map, startWith, switchMap, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'ish-basket-desired-delivery-date',
  standalone: false,
  templateUrl: './basket-desired-delivery-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketDesiredDeliveryDateComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;

  form = new FormGroup({});
  fields: FormlyFieldConfig[];

  model: { desiredDeliveryDate: Date };

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
        key: 'desiredDeliveryDate',
        type: 'ish-date-picker-field',
        props: {
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
              field.props.isSatExcluded ? SpecialValidators.noSaturday(control) : () => true,
            message: 'checkout.desired_delivery_date.error.no_saturday',
          },
          noSunday: {
            expression: (control: FormControl, field: FormlyFieldConfig) =>
              field.props.isSunExcluded ? SpecialValidators.noSunday(control) : () => true,
            message: 'checkout.desired_delivery_date.error.no_sunday',
          },
        },
        validation: {
          messages: {
            ngbDate: error => {
              if (Object.hasOwn(error, 'invalid')) {
                return 'checkout.desired_delivery_date.error.date';
              }
              if (Object.hasOwn(error, 'minDate')) {
                return 'checkout.desired_delivery_date.error.min_date';
              }
              if (Object.hasOwn(error, 'maxDate')) {
                return 'checkout.desired_delivery_date.error.max_date';
              }
              return;
            },
          },
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges<BasketDesiredDeliveryDateComponent>) {
    const previous = this.getDesiredDeliveryDate(changes.basket?.previousValue);
    const current = this.getDesiredDeliveryDate(changes.basket?.currentValue);

    // we only care about the ddd, so only do anything if it has changed
    if (current && !isEqual(previous, current)) {
      if (!changes.basket.firstChange) {
        this.successMessageTrigger$.next();
      }
      this.model = {
        ...this.model,
        desiredDeliveryDate: this.getDesiredDeliveryDate(this.basket),
      };
    }
  }

  private getDesiredDeliveryDate(basket: Basket): Date | undefined {
    const valueInBasket = AttributeHelper.getAttributeValueByAttributeName<string>(
      basket?.attributes,
      'desiredDeliveryDate'
    );
    if (valueInBasket) {
      // "Z" is added to set the timezone as constant UTC: https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators
      const input = `${valueInBasket}Z`;
      return parseISO(input);
    }
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

    this.checkoutFacade.setDesiredDeliveryDate(this.form.get('desiredDeliveryDate').value);
  }
}
