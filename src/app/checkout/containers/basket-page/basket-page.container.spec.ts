import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { AddBasketToQuoteRequest } from '../../../quoting/store/quote-request';
import { quotingReducers } from '../../../quoting/store/quoting.system';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadBasket, LoadBasketItemsSuccess, LoadBasketSuccess } from '../../store/basket/basket.actions';
import { checkoutReducers } from '../../store/checkout.system';

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
        MockComponent({ selector: 'ish-shopping-basket-empty', template: 'Shopping Basket Empty Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
          quoting: combineReducers(quotingReducers),
        }),
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

  it('should render loading component if AddBasketToQuoteRequest', () => {
    store$.dispatch(new AddBasketToQuoteRequest());
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
    const basket = { id: 'dummy' } as Basket;
    const lineItems = [{ id: '123', productSKU: 'SKU_123' }] as BasketItem[];
    store$.dispatch(new LoadBasketSuccess(basket));
    store$.dispatch(new LoadBasketItemsSuccess(lineItems));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket')).toBeTruthy();
  });

  it('should render recently viewed items on basket page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-recently-viewed-container')).toBeTruthy();
  });
});
