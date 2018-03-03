import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductRowComponent,
        MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-product-price', template: 'Product Price Component', inputs: ['product', 'showInformationalPrice'] }),
        MockComponent({ selector: 'ish-product-inventory', template: 'Product Inventory Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-product-row-actions-container', template: 'Product Row Actions Container', inputs: ['product'] })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = new Product('SKU');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

});
