import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { CheckoutShippingPageContainerComponent } from './checkout-shipping-page.container';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';

describe('Checkout Shipping Page Container', () => {
  let component: CheckoutShippingPageContainerComponent;
  let fixture: ComponentFixture<CheckoutShippingPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutShippingPageContainerComponent,
        MockComponent(CheckoutShippingComponent),
        MockComponent(LoadingComponent),
      ],

      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
        TranslateModule.forRoot(),
        ngrxTesting({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
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
