import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingStarComponent } from './product-rating-star.component';

describe('Product Rating Star Component', () => {
  let component: ProductRatingStarComponent;
  let fixture: ComponentFixture<ProductRatingStarComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRatingStarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
