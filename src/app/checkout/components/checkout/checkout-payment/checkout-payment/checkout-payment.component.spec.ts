import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsSharedModule } from '../../../../../forms/forms-shared.module';
import { BasketMockData } from '../../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../../utils/dev/mock.component';
import { CheckoutPaymentComponent } from './checkout-payment.component';

describe('Checkout Payment Component', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutPaymentComponent,
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-basket-items-summary',
          template: 'Basket Items Summary Component',
          inputs: ['basket'],
        }),
        MockComponent({
          selector: 'ish-basket-address-summary',
          template: 'Basket Address Summary Component',
          inputs: ['basket'],
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
