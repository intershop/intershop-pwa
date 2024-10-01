import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecurrenceComponent } from './order-recurrence.component';

describe('Order Recurrence Component', () => {
  let component: OrderRecurrenceComponent;
  let fixture: ComponentFixture<OrderRecurrenceComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderRecurrenceComponent],
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
});
