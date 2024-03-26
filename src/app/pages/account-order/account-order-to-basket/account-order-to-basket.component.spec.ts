import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Order } from 'ish-core/models/order/order.model';

import { AccountOrderToBasketComponent } from './account-order-to-basket.component';

describe('Account Order To Basket Component', () => {
  let component: AccountOrderToBasketComponent;
  let fixture: ComponentFixture<AccountOrderToBasketComponent>;
  let element: HTMLElement;

  let shoppingFacadeMock: ShoppingFacade;

  const testOrder = {
    id: '1',
    documentNo: '00000001',
    lineItems: [
      { productSKU: 'sku1', quantity: { value: 1 } },
      { productSKU: 'sku2', quantity: { value: 2 } },
    ] as LineItem[],
  } as Order;

  const testOrderFreeGift = {
    id: '2',
    documentNo: '00000002',
    lineItems: [{ productSKU: 'sku3', quantity: { value: 3 }, isFreeGift: true }] as LineItem[],
  } as Order;

  beforeEach(async () => {
    const checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketLoading$).thenReturn(of(false));

    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [AccountOrderToBasketComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderToBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the create basket from order button', () => {
    fixture.detectChanges();

    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should call addProductToBasket for every line item', () => {
    component.order = testOrder;

    component.addOrderToBasket();

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).twice();
  });

  it('should not add free gifts to the basket', () => {
    component.order = testOrderFreeGift;

    component.addOrderToBasket();

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).never();
  });
});
