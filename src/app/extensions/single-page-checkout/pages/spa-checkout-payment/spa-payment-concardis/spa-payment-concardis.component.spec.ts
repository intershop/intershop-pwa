import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaPaymentConcardisComponent } from './spa-payment-concardis.component';

describe('Spa Checkout Concardis Component', () => {
  let component: SpaPaymentConcardisComponent;
  let fixture: ComponentFixture<SpaPaymentConcardisComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaPaymentConcardisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaPaymentConcardisComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
