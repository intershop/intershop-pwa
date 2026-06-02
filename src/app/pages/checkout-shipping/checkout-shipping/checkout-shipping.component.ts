import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FormlyConfig, FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { ShippingRadioWrapperComponent } from '../formly/shipping-radio-wrapper/shipping-radio-wrapper.component';

// eslint-disable-next-line @typescript-eslint/naming-convention
const ShippingWrapperConfig: ConfigOption = {
  wrappers: [{ name: 'shipping-radio-wrapper', component: ShippingRadioWrapperComponent }],
};

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, FormlyForm, ReactiveFormsModule],
})
export class CheckoutShippingComponent implements OnInit {
  shippingMethods$: Observable<ShippingMethod[]>;
  basket$: Observable<BasketView>;

  shippingForm: FormGroup = new FormGroup({ shippingMethod: new FormControl() });
  model: { shippingMethod: string };
  shippingConfig$: Observable<FormlyFieldConfig[]>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private formlyConfig: FormlyConfig
  ) {
    const hasWrapper = !!this.formlyConfig.wrappers?.['shipping-radio-wrapper'];
    if (!hasWrapper) {
      this.formlyConfig.addConfig(ShippingWrapperConfig);
    }
  }
  ngOnInit() {
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethodsNoFetch$;
    this.basket$ = this.checkoutFacade.basket$;

    this.setupFormConfigConstruction();

    this.setupBasketShippingMethodUpdates();

    this.setupShippingMethodPreSelection();
  }

  private setupFormConfigConstruction() {
    this.shippingConfig$ = this.shippingMethods$.pipe(
      map(methods =>
        methods.map(method => ({
          type: 'ish-radio-field',
          key: 'shippingMethod',
          wrappers: ['shipping-radio-wrapper'],
          props: {
            description: method.description,
            id: `shipping_method_${method.id}`,
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(shippingId => {
        this.checkoutFacade.updateBasketShippingMethod(shippingId);
      });
  }

  /**
   * set shipping selection to the corresponding basket value (important in case of an error)
   * track selected method in form and model to ensure correct initialization after formly form generation
   */
  private setupShippingMethodPreSelection() {
    this.checkoutFacade
      .getValidShippingMethod$()
      .pipe(withLatestFrom(this.basket$), takeUntilDestroyed(this.destroyRef))
      .subscribe(([shippingMethod, basket]) => {
        if (basket.commonShippingMethod?.id !== shippingMethod) {
          this.checkoutFacade.updateBasketShippingMethod(shippingMethod);
        }
        this.shippingForm.get('shippingMethod').setValue(shippingMethod, { emitEvent: false });
        this.model = {
          ...this.model,
          shippingMethod,
        };
      });
  }
}
