import { DestroyRef, Injectable, NgZone, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { CompareFacade } from '../../compare/facades/compare.facade';
import { OrderTemplatesFacade } from '../../order-templates/facades/order-templates.facade';
import { ProductAdvisorToolCall } from '../models/product-advisor/product-advisor.model';

/**
 * Reacts to the action tool calls a Flowise chatflow reports (`usedTools`) and triggers the
 * corresponding action in the PWA - adding to the basket, comparing products, navigating and order
 * template actions.
 *
 * Note: the `icmSearch` tool is intentionally NOT handled here. Unlike the Copilot bubble (which
 * navigates to the search results page), the Product Advisor renders the found products in its
 * results panel on the same page - that happens in the page component via
 * `extractProductsFromToolCalls`, so no navigation is required.
 */
@Injectable({ providedIn: 'root' })
export class ProductAdvisorToolCallFacade {
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private shoppingFacade = inject(ShoppingFacade);
  private checkoutFacade = inject(CheckoutFacade);
  private compareFacade = inject(CompareFacade);
  private accountFacade = inject(AccountFacade);
  private orderTemplatesFacade = inject(OrderTemplatesFacade);

  /**
   * Handles all action tool calls of a chatflow response.
   *
   * @param toolCalls The `usedTools` of the response.
   */
  handleToolCalls(toolCalls: ProductAdvisorToolCall[] | undefined): void {
    (toolCalls ?? []).forEach(toolCall => this.handleToolCall(toolCall));
  }

  private handleToolCall(toolCall: ProductAdvisorToolCall): void {
    switch (toolCall?.tool) {
      case 'PWA_basket':
        this.handleBasket(toolCall.toolInput);
        break;
      case 'PWA_compare_products':
        // Note: this will only work if the 'compare' feature is enabled in the PWA
        this.compareFacade.compareProducts((toolCall.toolInput?.SKUs as string)?.split(';'));
        this.navigate('/compare');
        break;
      case 'PWA_navigate_to_page':
        this.handleNavigateToPage(toolCall.toolInput);
        break;
      case 'PWA_order_template_actions':
        this.handleOrderTemplate(toolCall.toolInput);
        break;
      default:
        break;
    }
  }

  /**
   * Makes sure navigation triggered by the chatflow runs within the Angular zone (the streaming
   * response is processed in a `fetch` callback outside of it).
   */
  private navigate(url: string) {
    this.ngZone.run(() => this.router.navigateByUrl(url));
  }

  /**
   * Triggers the corresponding basket action based on the `PWA_basket` tool call.
   */
  private handleBasket(toolInput: Record<string, unknown>) {
    const { operation, items } = (toolInput ?? {}) as Record<string, string>;
    const skusAndQty = (items?.split(';') ?? []).map(item => {
      const [sku, param] = item.split(':');
      const isAllQty = param?.toLowerCase() === 'all';
      return { sku, qty: isAllQty ? 1 : Number(param) || 1, isAllQty };
    });

    switch (operation) {
      case 'add':
        this.shoppingFacade.addProductsToBasket(skusAndQty.map(({ sku, qty }) => ({ sku, quantity: qty })));
        break;
      case 'update':
      case 'remove':
        this.checkoutFacade.basket$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(basket => {
          skusAndQty.forEach(({ sku, qty, isAllQty }) => {
            basket?.lineItems
              ?.filter(li => li?.productSKU === sku)
              ?.forEach(item => {
                if (operation === 'update') {
                  this.checkoutFacade.updateBasketItem({ itemId: item.id, quantity: qty });
                } else if (isAllQty) {
                  this.checkoutFacade.deleteBasketItem(item.id);
                } else {
                  const newQty = item?.quantity?.value - qty;
                  if (newQty >= 0) {
                    this.checkoutFacade.updateBasketItem({ itemId: item.id, quantity: newQty });
                  }
                }
              });
          });
        });
        break;
      case 'clear':
        this.checkoutFacade.deleteBasketItems();
        break;
      case 'view':
        this.navigate('/basket');
        break;
      default:
        break;
    }
  }

  /**
   * Triggers the corresponding navigation route based on the `PWA_navigate_to_page` tool call.
   */
  private handleNavigateToPage(toolInput: Record<string, unknown>) {
    const { page, sku, categoryId, orderId, orderTemplateId } = (toolInput ?? {}) as Record<string, string>;

    const navigationMap: Record<string, () => void> = {
      home: () => this.navigate('/'),
      basket: () => this.navigate('/basket'),
      product: () => this.navigate(`/product/${sku}`),
      category: () => this.navigate(`/category/${categoryId}`),
      order: () => this.navigate(`/account/orders/${orderId}`),
      orderHistory: () => this.navigate('/account/orders'),
      orderTemplates: () => this.navigate('/account/order-templates'),
      orderTemplate: () => this.navigate(`/account/order-templates/${orderTemplateId}`),
      myAccount: () => this.navigate('/account'),
      contact: () => this.navigate('/contact'),
      imprint: () => this.navigate('/page/page.legalnotice'),
      login: () => this.navigate('/login'),
      logout: () => this.accountFacade.logoutUser(),
    };
    if (navigationMap[page]) {
      navigationMap[page]();
    }
  }

  /**
   * Triggers the corresponding order template action based on the `PWA_order_template_actions` tool call.
   */
  private handleOrderTemplate(toolInput: Record<string, unknown>) {
    const { operation, sku, orderTemplateId, title, quantity } = (toolInput ?? {}) as Record<string, string>;

    switch (operation) {
      case 'create':
        this.orderTemplatesFacade.addOrderTemplate({ title });
        break;
      case 'add':
        if (sku && orderTemplateId) {
          this.orderTemplatesFacade.addProductToOrderTemplate(orderTemplateId, sku, quantity ? Number(quantity) : 1);
        }
        break;
      case 'remove':
        if (sku && orderTemplateId) {
          this.orderTemplatesFacade.removeProductFromOrderTemplate(orderTemplateId, sku);
        }
        break;
      case 'delete':
        if (orderTemplateId) {
          this.orderTemplatesFacade.deleteOrderTemplate(orderTemplateId);
        }
        break;
      default:
        break;
    }
  }
}
