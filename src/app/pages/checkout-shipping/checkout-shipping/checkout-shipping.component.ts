import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit, OnDestroy {
  isBusinessCustomer$: Observable<boolean>;

  shippingMethods$: Observable<ShippingMethod[]>;
  basket$: Observable<BasketView>;

  shippingForm: FormGroup = new FormGroup({ shippingMethod: new FormControl() });
  model: { shippingMethod: string };
  shippingConfig$: Observable<FormlyFieldConfig[]>;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade) {}
  ngOnInit() {
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethodsNoDispatch$;
    this.basket$ = this.checkoutFacade.basket$;

    this.setupFormConfigConstruction();

    this.setupBasketShippingMethodUpdates();

    this.setupShippingMethodPreselection();
  }

  private setupFormConfigConstruction() {
    this.shippingConfig$ = this.shippingMethods$.pipe(
      map(methods =>
        methods.map(method => ({
          type: 'ish-radio-field',
          key: 'shippingMethod',
          wrappers: ['shipping-radio-wrapper'],
          templateOptions: {
            shippingMethod: method,
            id: 'shipping_method' + method.id,
            value: method.id,
          },
        }))
      )
    );
  }

  private setupBasketShippingMethodUpdates() {
    this.shippingForm.valueChanges
      .pipe(
        map(vc => vc.shippingMethod),
        whenTruthy(),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(shippingId => {
        this.checkoutFacade.updateBasketShippingMethod(shippingId);
      });
  }

  /**
   * set shipping selection to the corresponding basket value (important in case of an error)
   * track selected method in form and model to ensure correct initialization after formly form generation
   */
  private setupShippingMethodPreselection() {
    combineLatest([this.shippingMethods$, this.basket$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([shippingMethods, basket]) => {
        // if a shipping method is selected and it's valid, do nothing
        const currentVal = this.shippingForm.get('shippingMethod').value;
        if (currentVal && shippingMethods.find(method => method.id === currentVal)) {
          return;
        }
        // if there is a basket, set shipping method accordingly
        if (basket) {
          this.shippingForm
            .get('shippingMethod')
            .setValue(basket?.commonShippingMethod?.id ?? '', { emitEvent: false });
        }
        // if there is no shipping method at basket or this basket shipping method is not valid anymore select automatically the 1st valid shipping method
        if (
          shippingMethods?.length &&
          (!basket?.commonShippingMethod?.id ||
            !shippingMethods.find(method => method.id === basket?.commonShippingMethod?.id ?? ''))
        ) {
          this.shippingForm.get('shippingMethod').setValue(shippingMethods[0].id);
        }
        this.model = {
          ...this.model,
          shippingMethod: this.shippingForm.get('shippingMethod').value,
        };
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
