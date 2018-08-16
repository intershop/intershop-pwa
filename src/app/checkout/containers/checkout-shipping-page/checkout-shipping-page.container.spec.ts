import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from '../../../utils/dev/mock.component';
import { checkoutReducers } from '../../store/checkout.system';

import { CheckoutShippingPageContainerComponent } from './checkout-shipping-page.container';

describe('Checkout Shipping Page Container', () => {
  let component: CheckoutShippingPageContainerComponent;
  let fixture: ComponentFixture<CheckoutShippingPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutShippingPageContainerComponent,
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({
          selector: 'ish-checkout-shipping',
          template: 'Checkout Shipping Component',
          inputs: ['basket', 'shippingMethods', 'error'],
        }),
      ],

      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render shipping component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-shipping')).toBeTruthy();
  });
});
