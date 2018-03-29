import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';
import { ProductTileContainerComponent } from '../product-tile/product-tile.container';

describe('Product Tile Container', () => {
  let component: ProductTileContainerComponent;
  let fixture: ComponentFixture<ProductTileContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ],
      declarations: [
        ProductTileContainerComponent,
        MockComponent({ selector: 'ish-product-tile', template: 'Product Tile Component', inputs: ['product', 'category', 'isInCompareList'] }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
