import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ProductPromotionComponent } from './product-promotion.component';

describe('Product Promotion Component', () => {
  let component: ProductPromotionComponent;
  let fixture: ComponentFixture<ProductPromotionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPromotionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
