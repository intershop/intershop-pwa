import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

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
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
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
