import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';

import { ProductInventoryComponent } from './product-inventory.component';

describe('Product Inventory Component', () => {
  let component: ProductInventoryComponent;
  let fixture: ComponentFixture<ProductInventoryComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductInventoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInventoryComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should show In Stock when inStock = true', () => {
    translate.set('product.instock.text', 'In Stock');
    product.inStock = true;
    product.availability = true;
    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('In Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/InStock'
    ).toBeTruthy();
  });

  it('should show Out of Stock when inStock = false', () => {
    translate.set('product.out_of_stock.text', 'Out of Stock');
    product.inStock = false;
    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('Out of Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/OutOfStock'
    ).toBeTruthy();
  });
});
