import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { Product } from '../../../../models/product/product.model';
import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = [new Product('sku')];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if one product tile (grid) is rendered', () => {
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-tile');
    expect(thumbs.length).toBe(1);
  });
});
