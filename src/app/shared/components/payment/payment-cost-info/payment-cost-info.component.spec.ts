import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PaymentCostInfoComponent } from './payment-cost-info.component';

describe('Payment Cost Info Component', () => {
  let component: PaymentCostInfoComponent;
  let fixture: ComponentFixture<PaymentCostInfoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentCostInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCostInfoComponent);
    component = fixture.componentInstance;
    component.basket = BasketMockData.getBasket();
    component.paymentMethod = BasketMockData.getPaymentMethod();
    component.priceType = 'gross';
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
