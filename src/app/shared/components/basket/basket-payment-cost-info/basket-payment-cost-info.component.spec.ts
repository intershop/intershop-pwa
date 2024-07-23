import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketPaymentCostInfoComponent } from './basket-payment-cost-info.component';

describe('Basket Payment Cost Info Component', () => {
  let component: BasketPaymentCostInfoComponent;
  let fixture: ComponentFixture<BasketPaymentCostInfoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        BasketPaymentCostInfoComponent,
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPaymentCostInfoComponent);
    component = fixture.componentInstance;
    component.basket = BasketMockData.getBasket();
    component.paymentMethod = {
      ...BasketMockData.getPaymentMethod(),
      paymentCosts: { type: 'PriceItem', net: 8.0, gross: 10.0, currency: 'USD' },
      paymentCostsThreshold: { type: 'PriceItem', net: 8000000.0, gross: 100000000.0, currency: 'USD' },
      isRestricted: false,
    };
    component.priceType = 'gross';
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display payment cost', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=basket-payment-cost]')).toBeTruthy();
  });

  it('should not display payment cost', () => {
    component.paymentMethod = {
      ...BasketMockData.getPaymentMethod(),
      paymentCosts: { type: 'PriceItem', net: 8.0, gross: 10.0, currency: 'USD' },
      paymentCostsThreshold: { type: 'PriceItem', net: 0.0, gross: 0.0, currency: 'USD' },
      isRestricted: false,
    };
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=basket-payment-cost]')).toBeFalsy();
  });

  it('should display payment restriction information', () => {
    component.paymentMethod = {
      ...BasketMockData.getPaymentMethod(),
      paymentCosts: { type: 'PriceItem', net: 8.0, gross: 10.0, currency: 'USD' },
      paymentCostsThreshold: { type: 'PriceItem', net: 8000000.0, gross: 100000000.0, currency: 'USD' },
      isRestricted: true,
      restrictionCauses: [{ code: 'payment.restriction.code', message: 'payment.restriction.code' }],
    };
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=basket-payment-restriction-information]')).toBeTruthy();
  });
});
