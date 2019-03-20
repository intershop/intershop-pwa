import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductTileContainerComponent } from './product-tile.container';

describe('Product Tile Container', () => {
  let component: ProductTileContainerComponent;
  let fixture: ComponentFixture<ProductTileContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
        MockComponent({
          selector: 'ish-product-tile',
          template: 'Product Tile Component',
          inputs: ['product', 'category', 'isInCompareList', 'variationOptions'],
        }),
        ProductTileContainerComponent,
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
