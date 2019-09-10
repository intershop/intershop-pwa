import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductBundleDisplayComponent } from './product-bundle-display.component';

describe('Product Bundle Display Component', () => {
  let component: ProductBundleDisplayComponent;
  let fixture: ComponentFixture<ProductBundleDisplayComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductBundleDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundleDisplayComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.productBundleParts = [
      { product: { sku: 'ABC', name: 'abc' } as ProductView, quantity: 3 },
      { product: { sku: 'DEF', name: 'def' } as ProductView, quantity: 2 },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li>3 x abc</li>
        <li>2 x def</li>
      </ul>
    `);
  });
});
