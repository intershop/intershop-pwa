import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit, OnChanges, OnDestroy {
  @Input() basket: Basket;
  @Input() shippingMethods: ShippingMethod[];
  @Input() error: HttpError;

  @Output() updateShippingMethod = new EventEmitter<string>();
  @Output() nextStep = new EventEmitter<void>();

  shippingForm: FormGroup;
  submitted = false;

  private destroy$ = new Subject();

  ngOnInit() {
    this.shippingForm = new FormGroup({
      id: new FormControl(this.getCommonShippingMethod()),
    });

    // trigger update shipping method if selection changes
    this.shippingForm
      .get('id')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(shippingId => this.updateShippingMethod.emit(shippingId));
  }

  private getCommonShippingMethod(): string {
    return this.basket && this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : '';
  }
  ngOnChanges(c: SimpleChanges) {
    if (this.shippingForm) {
      this.preSelectShippingMethod(c);
    }
  }
  /**
   * set shipping selection to the corresponding basket value (important in case of an error)
   */
  private preSelectShippingMethod(c: SimpleChanges) {
    if (c.basket) {
      this.shippingForm.get('id').setValue(this.getCommonShippingMethod(), { emitEvent: false });
    }

    // if there is no shipping method at basket or this basket shipping method is not valid anymore select automatically the 1st valid shipping method
    if (
      this.shippingMethods &&
      this.shippingMethods.length &&
      (!this.getCommonShippingMethod() ||
        !this.shippingMethods.find(method => method.id === this.getCommonShippingMethod()))
    ) {
      this.shippingForm.get('id').setValue(this.shippingMethods[0].id);
    }
  }

  /**
   * leads to next checkout page (checkout payment)
   */
  goToNextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.nextStep.emit();
    }
  }

  get nextDisabled() {
    return (
      !this.basket ||
      !this.shippingMethods ||
      !this.shippingMethods.length ||
      (!this.basket.commonShippingMethod && this.submitted)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
