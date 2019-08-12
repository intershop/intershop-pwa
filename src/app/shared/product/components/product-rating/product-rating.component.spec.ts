import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { ProductRatingStarComponent } from '../product-rating-star/product-rating-star.component';

import { ProductRatingComponent } from './product-rating.component';

describe('Product Rating Component', () => {
  let component: ProductRatingComponent;
  let fixture: ComponentFixture<ProductRatingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponents(ProductRatingStarComponent), ProductRatingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRatingComponent);
    component = fixture.componentInstance;
    component.product = { roundedAverageRating: '3' } as Product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
