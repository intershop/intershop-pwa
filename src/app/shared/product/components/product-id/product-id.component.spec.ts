import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';

import { ProductIdComponent } from './product-id.component';

const MOCK_PRODUCT: Product = {
  attributes: [],
  availability: true,
  completenessLevel: 1,
  failed: false,
  images: [],
  inStock: true,
  listPrice: {
    currency: 'EUR',
    value: 9.99,
  },
  longDescription: '',
  manufacturer: '',
  minOrderQuantity: 1,
  name: '',
  promotionIds: [],
  readyForShipmentMax: 1,
  readyForShipmentMin: 1,
  salePrice: {
    currency: 'EUR',
    value: 9.99,
  },
  shortDescription: '',
  sku: 'test-sku',
  type: 'Product',
};

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
    component.product = MOCK_PRODUCT;
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
