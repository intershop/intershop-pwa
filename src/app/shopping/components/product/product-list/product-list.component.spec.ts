import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductListComponent,
        MockComponent({ selector: 'ish-product-tile', template: 'Product Tile Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-product-row', template: 'Product Row Component', inputs: ['product'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = [new Product('SKU')];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-tile');
    expect(thumbs.length).toBe(1);
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-row');
    expect(thumbs.length).toBe(1);
  });
});
