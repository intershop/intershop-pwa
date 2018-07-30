import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfiniteScrollModule],
      declarations: [
        ProductListComponent,
        MockComponent({
          selector: 'ish-product-tile-container',
          template: 'Product Tile Container',
          inputs: ['product', 'category'],
        }),
        MockComponent({
          selector: 'ish-product-row-container',
          template: 'Product Row Container',
          inputs: ['product', 'category'],
        }),
        MockComponent({ selector: 'ish-loading-spinner', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = [{ sku: 'sku' } as Product];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-tile-container');
    expect(thumbs).toHaveLength(1);
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-row-container');
    expect(thumbs).toHaveLength(1);
  });
});
