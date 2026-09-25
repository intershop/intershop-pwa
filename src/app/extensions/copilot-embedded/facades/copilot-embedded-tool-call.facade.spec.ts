import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { CompareFacade } from '../../compare/facades/compare.facade';
import { OrderTemplatesFacade } from '../../order-templates/facades/order-templates.facade';

import { CopilotEmbeddedToolCallFacade } from './copilot-embedded-tool-call.facade';

describe('Copilot Embedded Tool Call Facade', () => {
  let facade: CopilotEmbeddedToolCallFacade;
  let router: Router;
  let shoppingFacade: ShoppingFacade;
  let checkoutFacade: CheckoutFacade;
  let compareFacade: CompareFacade;
  let orderTemplatesFacade: OrderTemplatesFacade;
  let accountFacade: AccountFacade;

  beforeEach(() => {
    router = mock(Router);
    shoppingFacade = mock(ShoppingFacade);
    checkoutFacade = mock(CheckoutFacade);
    compareFacade = mock(CompareFacade);
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    accountFacade = mock(AccountFacade);

    when(checkoutFacade.basket$).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        { provide: Router, useFactory: () => instance(router) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    });

    facade = TestBed.inject(CopilotEmbeddedToolCallFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should ignore unknown, empty and icmSearch tool calls without navigating', () => {
    expect(() => facade.handleToolCalls(undefined)).not.toThrow();
    facade.handleToolCalls([
      { tool: 'unknown', toolInput: {} },
      { tool: 'icmSearch', toolInput: { query: 'laptops' }, toolOutput: '{}' },
    ]);
    verify(router.navigateByUrl(anything())).never();
  });

  describe('PWA_basket', () => {
    it('should add products to the basket on operation "add"', () => {
      facade.handleToolCalls([{ tool: 'PWA_basket', toolInput: { operation: 'add', items: '123:2;456:1' } }]);

      verify(shoppingFacade.addProductsToBasket(anything())).once();
      const [items] = capture(shoppingFacade.addProductsToBasket).last();
      expect(items).toEqual([
        { sku: '123', quantity: 2 },
        { sku: '456', quantity: 1 },
      ]);
    });

    it('should navigate to the basket on operation "view"', () => {
      facade.handleToolCalls([{ tool: 'PWA_basket', toolInput: { operation: 'view' } }]);

      verify(router.navigateByUrl('/basket')).once();
    });
  });

  describe('PWA_compare_products', () => {
    it('should compare the given SKUs and navigate to the compare page', () => {
      facade.handleToolCalls([{ tool: 'PWA_compare_products', toolInput: { SKUs: '123;456' } }]);

      verify(compareFacade.compareProducts(anything())).once();
      const [skus] = capture(compareFacade.compareProducts).last();
      expect(skus).toEqual(['123', '456']);
      verify(router.navigateByUrl('/compare')).once();
    });
  });

  describe('PWA_navigate_to_page', () => {
    it('should navigate to the product page', () => {
      facade.handleToolCalls([{ tool: 'PWA_navigate_to_page', toolInput: { page: 'product', sku: '123' } }]);

      verify(router.navigateByUrl('/product/123')).once();
    });

    it('should log out on page "logout"', () => {
      facade.handleToolCalls([{ tool: 'PWA_navigate_to_page', toolInput: { page: 'logout' } }]);

      verify(accountFacade.logoutUser()).once();
    });
  });

  describe('PWA_order_template_actions', () => {
    it('should create an order template on operation "create"', () => {
      facade.handleToolCalls([
        { tool: 'PWA_order_template_actions', toolInput: { operation: 'create', title: 'My List' } },
      ]);

      verify(orderTemplatesFacade.addOrderTemplate(anything())).once();
      const [payload] = capture(orderTemplatesFacade.addOrderTemplate).last();
      expect(payload).toEqual({ title: 'My List' });
    });
  });
});
