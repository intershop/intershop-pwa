import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketRecurrenceSummaryComponent } from './basket-recurrence-summary.component';

describe('Basket Recurrence Summary Component', () => {
  let component: BasketRecurrenceSummaryComponent;
  let fixture: ComponentFixture<BasketRecurrenceSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketRecurrenceSummaryComponent],
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
});
