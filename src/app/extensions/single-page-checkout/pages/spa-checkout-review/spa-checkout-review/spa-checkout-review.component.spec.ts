import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutReviewComponent } from './spa-checkout-review.component';

describe('Spa Checkout Review Component', () => {
  let component: SpaCheckoutReviewComponent;
  let fixture: ComponentFixture<SpaCheckoutReviewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutReviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutReviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
