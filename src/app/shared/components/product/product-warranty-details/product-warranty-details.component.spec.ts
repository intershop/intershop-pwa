import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWarrantyDetailsComponent } from './product-warranty-details.component';

describe('Product Warranty Details Component', () => {
  let component: ProductWarrantyDetailsComponent;
  let fixture: ComponentFixture<ProductWarrantyDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductWarrantyDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWarrantyDetailsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
