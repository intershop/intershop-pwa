import { formatDate } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketShippingMethodComponent } from './basket-shipping-method.component';

describe('Basket Shipping Method Component', () => {
  let component: BasketShippingMethodComponent;
  let fixture: ComponentFixture<BasketShippingMethodComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        BasketShippingMethodComponent,
        MockPipe(DatePipe, value => formatDate(new Date(Date.parse(value as string)), 'mediumDate', 'en-US')),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketShippingMethodComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.data = {
      ...BasketMockData.getBasket(),
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-03-17' }],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show shipping method name', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="shippingMethodName"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="shippingMethodName"]').textContent).toContain('Standard Ground');
  });

  it('should show desired delivery date', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="desiredDeliveryDate"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="desiredDeliveryDate"]').textContent).toContain('Mar 17, 2022');
  });
});
