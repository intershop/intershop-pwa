import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { VariationProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductVariationDisplayComponent } from './product-variation-display.component';

describe('Product Variation Display Component', () => {
  let component: ProductVariationDisplayComponent;
  let fixture: ComponentFixture<ProductVariationDisplayComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductVariationDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationDisplayComponent);
    component = fixture.componentInstance;

    component.product = {
      sku: 'SKU',
      variableVariationAttributes: [],
    } as VariationProductView;

    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
