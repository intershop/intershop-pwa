import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ProductBundlePartsComponent } from './product-bundle-parts.component';

describe('Product Bundle Parts Component', () => {
  let component: ProductBundlePartsComponent;
  let fixture: ComponentFixture<ProductBundlePartsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBundlePartsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundlePartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
