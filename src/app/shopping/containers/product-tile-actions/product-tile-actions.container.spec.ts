import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';
import { ProductTileActionsContainerComponent } from './product-tile-actions.container';

describe('Product Tile Actions Container', () => {
  let component: ProductTileActionsContainerComponent;
  let fixture: ComponentFixture<ProductTileActionsContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ],
      declarations: [
        ProductTileActionsContainerComponent,
        MockComponent({ selector: 'ish-product-tile-actions', template: 'Product Tile Actions Component', inputs: ['isInCompareList'] }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsContainerComponent);
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
