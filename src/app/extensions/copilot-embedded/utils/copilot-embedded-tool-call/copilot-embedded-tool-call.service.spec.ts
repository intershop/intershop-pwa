import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';

import { CompareFacade } from '../../../compare/facades/compare.facade';
import { OrderTemplatesFacade } from '../../../order-templates/facades/order-templates.facade';

import { CopilotEmbeddedToolCallService } from './copilot-embedded-tool-call.service';

describe('Copilot Embedded Tool Call Service', () => {
  let toolCallService: CopilotEmbeddedToolCallService;
  let router: Router;
  let shoppingFacade: ShoppingFacade;
  let checkoutFacade: CheckoutFacade;
  let compareFacade: CompareFacade;
  let orderTemplatesFacade: OrderTemplatesFacade;
  let featureToggleService: FeatureToggleService;

  beforeEach(() => {
    router = mock(Router);
    shoppingFacade = mock(ShoppingFacade);
    checkoutFacade = mock(CheckoutFacade);
    compareFacade = mock(CompareFacade);
    orderTemplatesFacade = mock(OrderTemplatesFacade);
    featureToggleService = mock(FeatureToggleService);

    when(checkoutFacade.basket$).thenReturn(of(undefined));
    when(featureToggleService.enabled(anything())).thenReturn(true);

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        { provide: Router, useFactory: () => instance(router) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    });

    toolCallService = TestBed.inject(CopilotEmbeddedToolCallService);
  });

  it('should be created', () => {
    expect(toolCallService).toBeTruthy();
  });

  it('should ignore unknown, empty and icmSearch tool calls without navigating', () => {
    expect(() => toolCallService.triggerToolCallActions(undefined)).not.toThrow();
    toolCallService.triggerToolCallActions([
      { tool: 'unknown', toolInput: {} },
      { tool: 'icmSearch', toolInput: { query: 'laptops' }, toolOutput: '{}' },
    ]);
    verify(router.navigateByUrl(anything())).never();
  });

  describe('PWA_basket', () => {
    it('should add products to the basket on operation "add"', () => {
      toolCallService.triggerToolCallActions([
        { tool: 'PWA_basket', toolInput: { operation: 'add', items: '123:2;456:1' } },
      ]);

      verify(shoppingFacade.addProductsToBasket(anything())).once();
      const [items] = capture(shoppingFacade.addProductsToBasket).last();
      expect(items).toEqual([
        { sku: '123', quantity: 2 },
        { sku: '456', quantity: 1 },
      ]);
    });

    it('should navigate to the basket on operation "view"', () => {
      toolCallService.triggerToolCallActions([{ tool: 'PWA_basket', toolInput: { operation: 'view' } }]);

      verify(router.navigateByUrl('/basket')).once();
    });
  });

  describe('PWA_compare_products', () => {
    it('should compare the given SKUs and navigate to the compare page', () => {
      toolCallService.triggerToolCallActions([{ tool: 'PWA_compare_products', toolInput: { SKUs: '123;456' } }]);

      verify(compareFacade.compareProducts(anything())).once();
      const [skus] = capture(compareFacade.compareProducts).last();
      expect(skus).toEqual(['123', '456']);
      verify(router.navigateByUrl('/compare')).once();
    });

    it('should ignore the tool call if the compare feature is disabled', () => {
      when(featureToggleService.enabled('compare')).thenReturn(false);

      toolCallService.triggerToolCallActions([{ tool: 'PWA_compare_products', toolInput: { SKUs: '123;456' } }]);

      verify(compareFacade.compareProducts(anything())).never();
      verify(router.navigateByUrl(anything())).never();
    });
  });

  describe('PWA_navigate_to_page', () => {
    it('should navigate to the product page', () => {
      toolCallService.triggerToolCallActions([
        { tool: 'PWA_navigate_to_page', toolInput: { page: 'product', sku: '123' } },
      ]);

      verify(router.navigateByUrl('/product/123')).once();
    });

    it('should navigate to the logout route on page "logout"', () => {
      toolCallService.triggerToolCallActions([{ tool: 'PWA_navigate_to_page', toolInput: { page: 'logout' } }]);

      verify(router.navigateByUrl('/logout')).once();
    });

    it('should not navigate to order templates if the feature is disabled', () => {
      when(featureToggleService.enabled('orderTemplates')).thenReturn(false);

      toolCallService.triggerToolCallActions([{ tool: 'PWA_navigate_to_page', toolInput: { page: 'orderTemplates' } }]);

      verify(router.navigateByUrl(anything())).never();
    });
  });

  describe('PWA_order_template_actions', () => {
    it('should create an order template on operation "create"', () => {
      toolCallService.triggerToolCallActions([
        { tool: 'PWA_order_template_actions', toolInput: { operation: 'create', title: 'My List' } },
      ]);

      verify(orderTemplatesFacade.addOrderTemplate(anything())).once();
      const [payload] = capture(orderTemplatesFacade.addOrderTemplate).last();
      expect(payload).toEqual({ title: 'My List' });
    });

    it('should ignore the tool call if the order templates feature is disabled', () => {
      when(featureToggleService.enabled('orderTemplates')).thenReturn(false);

      toolCallService.triggerToolCallActions([
        { tool: 'PWA_order_template_actions', toolInput: { operation: 'create', title: 'My List' } },
      ]);

      verify(orderTemplatesFacade.addOrderTemplate(anything())).never();
    });
  });
});
