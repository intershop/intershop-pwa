import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { FrequencyPipe } from 'ish-core/pipes/frequency.pipe';

import { OrderRecurrenceComponent } from './order-recurrence.component';

describe('Order Recurrence Component', () => {
  let component: OrderRecurrenceComponent;
  let fixture: ComponentFixture<OrderRecurrenceComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockPipe(DatePipe), MockPipe(FrequencyPipe), OrderRecurrenceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRecurrenceComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display order recurrence details when recurrence is provided', () => {
    component.recurrence = {
      interval: 'P1W',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      repetitions: 5,
    };
    component.labelCssClass = 'col-6';
    component.valueCssClass = 'col-6 text-right';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <dl class="row dl-horizontal dl-separator">
        <dt class="col-6">order.recurrence.interval.label</dt>
        <dd class="col-6 text-right"></dd>
        <dt class="col-6">order.recurrence.start.label</dt>
        <dd class="col-6 text-right"></dd>
        <dt data-testing-id="end-date-label" class="col-6">order.recurrence.end.label</dt>
        <dd class="col-6 text-right"></dd>
        <dt data-testing-id="repetitions-label" class="col-6">order.recurrence.repetitions.label</dt>
        <dd class="col-6 text-right">order.recurrence.repetitions.text</dd>
      </dl>
    `);
  });

  it('should display order recurrence details without end date when recurrence with repetitions is provided', () => {
    component.recurrence = {
      interval: 'P1W',
      startDate: '2023-01-01',
      endDate: undefined,
      repetitions: 5,
    };
    component.labelCssClass = 'col-6';
    component.valueCssClass = 'col-6 text-right';
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="end-date-label"]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id="repetitions-label"]')).toBeTruthy();
  });

  it('should display order recurrence details without repetitions when recurrence with end date is provided', () => {
    component.recurrence = {
      interval: 'P1W',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      repetitions: undefined,
    };
    component.labelCssClass = 'col-6';
    component.valueCssClass = 'col-6 text-right';
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="end-date-label"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="repetitions-label"]')).toBeFalsy();
  });

  it('should not display recurrence details when recurrence is not provided', () => {
    component.recurrence = undefined;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
