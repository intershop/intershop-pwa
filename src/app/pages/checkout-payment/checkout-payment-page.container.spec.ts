import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CheckoutPaymentPageContainerComponent } from './checkout-payment-page.container';

describe('Checkout Payment Page Container', () => {
  let component: CheckoutPaymentPageContainerComponent;
  let fixture: ComponentFixture<CheckoutPaymentPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutPaymentPageContainerComponent,
        MockComponent({
          selector: 'ish-checkout-payment',
          template: 'Checkout Payment Component',
          inputs: ['basket', 'paymentMethods', 'error'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],

      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render payment component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-payment')).toBeTruthy();
  });
});
