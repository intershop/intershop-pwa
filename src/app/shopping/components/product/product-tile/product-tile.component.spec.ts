import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductTileComponent } from './product-tile.component';

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ProductTileComponent,
        MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-product-price', template: 'Product Price Component', inputs: ['product', 'showInformationalPrice'] }),
        MockComponent({ selector: 'ish-product-tile-actions-container', template: 'Product Tile Actions Container', inputs: ['product'] })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileComponent);
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
