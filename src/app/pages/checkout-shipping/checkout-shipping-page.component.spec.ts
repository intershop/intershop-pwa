import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutShippingPageComponent } from './checkout-shipping-page.component';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';

describe('Checkout Shipping Page Component', () => {
  let component: CheckoutShippingPageComponent;
  let fixture: ComponentFixture<CheckoutShippingPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutShippingPageComponent,
        MockComponent(CheckoutShippingComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingPageComponent);
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
