import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, combineLatest, debounce, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { whenFalsy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-basket-custom-fields',
  templateUrl: './basket-custom-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCustomFieldsComponent implements OnInit {
  customFields$: Observable<CustomFieldsComponentInput[]>;

  visible$: Observable<boolean>;
  noValues$: Observable<boolean>;

  constructor(private appFacade: AppFacade, private checkoutFacade: CheckoutFacade) {}

  form = new UntypedFormGroup({});

  ngOnInit(): void {
    this.customFields$ = combineLatest([
      this.appFacade.customFieldsForScope$('Basket'),
      this.checkoutFacade.basket$.pipe(debounce(() => this.checkoutFacade.basketLoading$.pipe(whenFalsy()))),
    ]).pipe(
      map(([customFields, basket]) =>
        customFields.map(customField => ({ ...customField, value: basket.customFields[customField.name] }))
      )
    );

    this.visible$ = this.customFields$.pipe(map(fields => fields.length > 0));

    this.noValues$ = this.customFields$.pipe(map(fields => fields.length > 0 && fields.every(field => !field.value)));
  }

  submit() {
    this.checkoutFacade.setBasketCustomFields(this.form.value);
  }

  submitDisabled(): boolean {
    return !this.form.valid || this.form.pristine;
  }
}
