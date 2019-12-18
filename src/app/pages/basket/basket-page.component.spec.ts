import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { LoadBasket, LoadBasketSuccess } from 'ish-core/store/checkout/basket';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { RecentlyViewedComponent } from 'ish-shared/components/recently/recently-viewed/recently-viewed.component';

import { BasketPageComponent } from './basket-page.component';
import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

describe('Basket Page Component', () => {
  let component: BasketPageComponent;
  let fixture: ComponentFixture<BasketPageComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketPageComponent,
        MockComponent(LoadingComponent),
        MockComponent(RecentlyViewedComponent),
        MockComponent(ShoppingBasketComponent),
        MockComponent(ShoppingBasketEmptyComponent),
      ],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if there is no basket', () => {
    store$.dispatch(new LoadBasket({ id: 'BASKET_ID' }));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render empty basket component if the basket has no line items', () => {
    const basket = { id: 'dummy', lineItems: [] } as Basket;
    store$.dispatch(new LoadBasketSuccess({ basket }));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket-empty')).toBeTruthy();
  });

  it('should render shopping basket component if there is a basket with line items', () => {
    const basket = { id: 'dummy', lineItems: [{ id: '123', productSKU: 'SKU_123' }] as LineItem[] } as Basket;
    store$.dispatch(new LoadBasketSuccess({ basket }));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket')).toBeTruthy();
  });

  it('should render recently viewed items on basket page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-recently-viewed')).toBeTruthy();
  });
});
