import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { LoadBasket, LoadBasketSuccess } from 'ish-core/store/checkout/basket';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { BasketPageContainerComponent } from './basket-page.container';

describe('Basket Page Container', () => {
  let component: BasketPageContainerComponent;
  let fixture: ComponentFixture<BasketPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketPageContainerComponent,
        MockComponent({
          selector: 'ish-shopping-basket',
          template: 'Shopping Basket Component',
          inputs: ['basket', 'error'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        MockComponent({ selector: 'ish-shopping-basket-empty', template: 'Shopping Basket Empty Component' }),
      ],
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPageContainerComponent);
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
    store$.dispatch(new LoadBasket('BASKET_ID'));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render empty basket component if the basket has no line items', () => {
    const basket = { id: 'dummy', lineItems: [] } as Basket;
    store$.dispatch(new LoadBasketSuccess(basket));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket-empty')).toBeTruthy();
  });

  it('should render shopping basket component if there is a basket with line items', () => {
    const basket = { id: 'dummy', lineItems: [{ id: '123', productSKU: 'SKU_123' }] as LineItem[] } as Basket;
    store$.dispatch(new LoadBasketSuccess(basket));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket')).toBeTruthy();
  });

  it('should render recently viewed items on basket page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-recently-viewed-container')).toBeTruthy();
  });
});
