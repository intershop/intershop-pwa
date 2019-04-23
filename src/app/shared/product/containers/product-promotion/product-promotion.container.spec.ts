import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';

import { Price } from 'ish-core/models/price/price.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductPromotionContainerComponent } from './product-promotion.container';

describe('Product Promotion Container', () => {
  let component: ProductPromotionContainerComponent;
  let fixture: ComponentFixture<ProductPromotionContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
          selector: 'ish-product-promotion',
          template: 'Product Promotion Component',
          inputs: ['promotion', 'displayType'],
        }),
        ProductPromotionContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = {
      name: 'test',
      shortDescription: 'test',
      longDescription: 'test',
      availability: true,
      inStock: true,
      minOrderQuantity: 1,
      attributes: [],
      images: [],
      listPrice: {} as Price,
      salePrice: {} as Price,
      manufacturer: 'test',
      readyForShipmentMin: 1,
      readyForShipmentMax: 1,
      sku: 'test',
      type: 0,
      promotions: [
        {
          itemId: 'PROMO_UUID',
          title: 'MyPromotionTitle',
        },
      ],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
