import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ProductPromotionComponent } from 'ish-shared/product/components/product-promotion/product-promotion.component';

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
      declarations: [MockComponent(ProductPromotionComponent), ProductPromotionContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = {
      name: 'test',
      sku: 'test',
      promotionIds: ['PROMO_UUID'],
    } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
