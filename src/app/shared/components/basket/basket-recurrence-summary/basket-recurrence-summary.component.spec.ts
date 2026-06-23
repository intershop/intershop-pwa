import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

import { BasketRecurrenceSummaryComponent } from './basket-recurrence-summary.component';

describe('Basket Recurrence Summary Component', () => {
  let component: BasketRecurrenceSummaryComponent;
  let fixture: ComponentFixture<BasketRecurrenceSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [BasketRecurrenceSummaryComponent, MockComponent(OrderRecurrenceComponent)],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketRecurrenceSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display  recurrence summary for a given basket recurrence', () => {
    component.recurrence = {
      interval: 'P1W',
      startDate: '2023-01-01',
      endDate: undefined,
      repetitions: 5,
    };
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="cart-summary">
        <h3 class="h5">order.recurrence.heading</h3>
        <ish-order-recurrence
          labelcssclass="col-6"
          valuecssclass="col-6 text-end"
          ng-reflect-label-css-class="col-6"
          ng-reflect-value-css-class="col-6 text-end"
        ></ish-order-recurrence>
      </div>
    `);
  });

  it('should not display recurrence summary when no basket recurrence is provided', () => {
    component.recurrence = undefined;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
