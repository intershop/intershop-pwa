import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Basket } from '../../../models/basket/basket.model';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadBasket, LoadBasketSuccess } from '../../store/basket/basket.actions';
import { CheckoutState } from '../../store/checkout.state';
import { checkoutReducers } from '../../store/checkout.system';
import { BasketPageContainerComponent } from './basket-page.container';

describe('Basket Page Container', () => {
  let component: BasketPageContainerComponent;
  let fixture: ComponentFixture<BasketPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<CheckoutState>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          BasketPageContainerComponent,
          MockComponent({ selector: 'ish-shopping-basket', template: 'Shopping Basket Component', inputs: ['basket'] }),
          MockComponent({ selector: 'ish-shopping-basket-empty', template: 'Shopping Basket Empty Component' }),
          MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
          MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        ],
        imports: [
          TranslateModule.forRoot(),
          StoreModule.forRoot({
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          }),
        ],
      }).compileComponents();
    })
  );

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
    const basket = { id: 'dummy', lineItems: [{ id: '123', product: { title: 'SKU_123' } }] } as Basket;
    store$.dispatch(new LoadBasketSuccess(basket));
    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket')).toBeTruthy();
  });

  it('should render recently viewed items on basket page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-recently-viewed-container')).toBeTruthy();
  });
});
