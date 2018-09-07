import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';

import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';

import { ProductTileContainerComponent } from './product-tile.container';

describe('Product Tile Container', () => {
  let component: ProductTileContainerComponent;
  let fixture: ComponentFixture<ProductTileContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        NgbModalModule,
      ],
      declarations: [
        ProductTileContainerComponent,
        MockComponent({
          selector: 'ish-product-tile',
          template: 'Product Tile Component',
          inputs: ['product', 'category', 'isInCompareList'],
        }),
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.productSku = 'sku';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
