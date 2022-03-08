import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { LazyRecentlyViewedComponent } from '../../extensions/recently/exports/lazy-recently-viewed/lazy-recently-viewed.component';

import { BasketPageComponent } from './basket-page.component';
import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

describe('Basket Page Component', () => {
  let component: BasketPageComponent;
  let fixture: ComponentFixture<BasketPageComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [
        BasketPageComponent,
        MockComponent(ContentIncludeComponent),
        MockComponent(LazyRecentlyViewedComponent),
        MockComponent(LoadingComponent),

        MockComponent(ShoppingBasketComponent),
        MockComponent(ShoppingBasketEmptyComponent),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if there is no basket', () => {
    when(checkoutFacade.basketLoading$).thenReturn(of(true));

    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render empty basket component if the basket has no line items', () => {
    const basket = { id: 'dummy', lineItems: [] } as BasketView;
    when(checkoutFacade.basket$).thenReturn(of(basket));

    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket-empty')).toBeTruthy();
  });

  it('should render shopping basket component if there is a basket with line items', () => {
    const basket = { id: 'dummy', lineItems: [{ id: '123', productSKU: 'SKU_123' }] as LineItem[] } as BasketView;
    when(checkoutFacade.basket$).thenReturn(of(basket));

    fixture.detectChanges();
    expect(element.querySelector('ish-shopping-basket')).toBeTruthy();
  });

  it('should render recently viewed items on basket page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-lazy-recently-viewed')).toBeTruthy();
  });
});
