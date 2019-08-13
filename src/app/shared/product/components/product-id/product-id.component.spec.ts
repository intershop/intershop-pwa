import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';

import { ProductIdComponent } from './product-id.component';

describe('Product Id Component', () => {
  let component: ProductIdComponent;
  let fixture: ComponentFixture<ProductIdComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductIdComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIdComponent);
    component = fixture.componentInstance;
    component.product = { sku: 'test-sku' } as Product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display id for given product id', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-id').textContent).toContain('test-sku');
  });
});
