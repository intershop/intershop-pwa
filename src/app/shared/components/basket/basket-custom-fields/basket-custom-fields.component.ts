import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, combineLatest, debounce, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { whenFalsy } from 'ish-core/utils/operators';

/**
 * The Basket Custom Fields Component displays the basket attribute values. If editable it shows a link to add/edit these attributes.
 */
@Component({
  selector: 'ish-basket-custom-fields',
  standalone: false,
  templateUrl: './basket-custom-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCustomFieldsComponent implements OnInit {
  customFields$: Observable<CustomFieldsComponentInput[]>;
  visible$: Observable<boolean>;
  editMode$: Observable<'edit' | 'add'>;

  collapsed = true;
  form = new FormGroup({});

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.customFields$ = combineLatest([
      this.checkoutFacade.customFieldsForScope$('Basket'),
      this.checkoutFacade.basket$.pipe(debounce(() => this.checkoutFacade.basketLoading$.pipe(whenFalsy()))),
    ]).pipe(
      map(([customFields, basket]) =>
        customFields.map(customField => ({ ...customField, value: basket.customFields?.[customField.name] }))
      )
    );

    this.visible$ = this.customFields$.pipe(map(fields => fields.length > 0));

    this.editMode$ = this.customFields$.pipe(
      map(fields => (fields.length > 0 && fields.every(field => !field.value) ? 'add' : 'edit'))
    );
  }

  submit() {
    this.checkoutFacade.setBasketCustomFields(this.form.value);
    this.collapsed = true;
  }

  cancel() {
    this.collapsed = true;
    this.form.reset();
  }
}
