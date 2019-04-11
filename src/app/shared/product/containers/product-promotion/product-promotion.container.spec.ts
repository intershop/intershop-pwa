import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule, combineReducers } from '@ngrx/store';

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
          inputs: ['promotion'],
        }),
        ProductPromotionContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPromotionContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.promotionId = 'id';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
