import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutReviewPageComponent } from './spa-checkout-review-page.component';

describe('Spa Checkout Review Component', () => {
  let component: SpaCheckoutReviewPageComponent;
  let fixture: ComponentFixture<SpaCheckoutReviewPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutReviewPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutReviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
