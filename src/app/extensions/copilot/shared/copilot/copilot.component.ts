import { ChangeDetectionStrategy, Component, DestroyRef, Inject, NgZone, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { THEME_COLOR } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { InjectSingle } from 'ish-core/utils/injection';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { CompareFacade } from '../../../compare/facades/compare.facade';
import { OrderTemplatesFacade } from '../../../order-templates/facades/order-templates.facade';
import { CopilotFacade } from '../../facades/copilot.facade';
import { ChatbotMessage, ChatbotToolCall } from '../../models/copilot-chatbot/copilot-chatbot.model';
import { CopilotConfig } from '../../models/copilot-config/copilot-config.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- allows access to Flowise Chatbot js functionality */
declare let Chatbot: any;

/**
 * The Copilot Component
 *
 * This component initializes the Flowise Chatbot and provides the necessary configuration and localization data.
 * It also handles the communication between the Chatbot and the PWA.
 *
 * @example
 * <ish-lazy-copilot />
 */
@Component({
  selector: 'ish-copilot',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
@GenerateLazyComponent()
export class CopilotComponent {
  private destroyRef = inject(DestroyRef);

  constructor(
    private copilotFacade: CopilotFacade,
    private scriptLoader: ScriptLoaderService,
    private translateService: TranslateService,
    private ngZone: NgZone,
    private router: Router,
    private appFacade: AppFacade,
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    private compareFacade: CompareFacade,
    private accountFacade: AccountFacade,
    private orderTemplatesFacade: OrderTemplatesFacade,
    @Inject(THEME_COLOR) private themeColor: InjectSingle<typeof THEME_COLOR>
  ) {
    // afterNextRender = only rendered in browser
    afterNextRender(() => {
      this.loadCopilot();
    });
  }

  /**
   * Load the Flowise Chatbot functionality and initialize it with the fetched configuration and localization data.
   */
  private loadCopilot() {
    combineLatest([
      this.copilotFacade.copilotConfiguration$.pipe(
        switchMap(config => this.scriptLoader.load(config.copilotUIFile, { type: 'module' }).pipe(map(() => config)))
      ),
      this.translateService.get([
        'copilot.disclaimer.buttonText',
        'copilot.disclaimer.message',
        'copilot.disclaimer.title',
        'copilot.footer.company_link',
        'copilot.footer.company',
        'copilot.footer.text',
        'copilot.max_chars_warning_message',
        'copilot.placeholder',
        'copilot.starter_prompt_1',
        'copilot.starter_prompt_2',
        'copilot.title',
        'copilot.welcome_message',
      ]),
      this.appFacade.getRestEndpointWithContext$,
      this.appFacade.currentLocale$,
    ])
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(([config, localizations, restEndpoint, currentLocale]) => {
        this.initializeCopilot(config, localizations, restEndpoint, currentLocale, this.getPrimaryColor());
      });
  }

  /**
   * Initialize the Flowise Chatbot with the provided configuration and localization data.
   */
  initializeCopilot(
    copilotConfig: CopilotConfig,
    localizations: Record<string, string>,
    restEndpoint: string,
    currentLocale: string,
    primaryColor: string
  ) {
    let lastMessage: ChatbotMessage;
    let previousLoading = false;

    Chatbot.init({
      // general configuration
      chatflowid: copilotConfig.chatflowid,
      apiHost: copilotConfig.apiHost,
      chatflowConfig: {
        vars: {
          restEndpoint,
          currentLocale,

          // TODO: provide additional personalization context information if it can be handled by the chatbot
          // user_token: localStorage.getItem('icm_access_token'),
          // customer: this.accountFacade.userEmail$,

          // override/extend the chatflowConfig vars via deployment copilotConfig adaptions
          ...copilotConfig.chatflowConfig?.vars,
        },
      },

      // theme/localization configuration
      theme: merge(
        {
          button: {
            backgroundColor: primaryColor,
            dragAndDrop: true,
            right: 15,
            bottom: 60,
            size: 38,
          },
          chatWindow: {
            showTitle: true,
            showAgentMessages: false,
            title: localizations['copilot.title'],
            welcomeMessage: localizations['copilot.welcome_message'],
            backgroundColor: '#f8f9fa',
            fontSize: 16,
            starterPrompts: [localizations['copilot.starter_prompt_1'], localizations['copilot.starter_prompt_2']],
            clearChatOnReload: false, // If set to true, the chat will be cleared when the page reloads
            botMessage: {
              backgroundColor: '#ffffff',
            },
            userMessage: {
              backgroundColor: primaryColor,
            },
            textInput: {
              placeholder: localizations['copilot.placeholder'],
              maxCharsWarningMessage: localizations['copilot.max_chars_warning_message'],
              maxChars: 200,
              sendButtonColor: primaryColor,
            },
            footer: {
              text: localizations['copilot.footer.text'],
              company: localizations['copilot.footer.company'],
              companyLink: localizations['copilot.footer.company_link'],
            },
          },
          disclaimer: {
            title: localizations['copilot.disclaimer.title'],
            message: localizations['copilot.disclaimer.message'],
            buttonText: localizations['copilot.disclaimer.buttonText'],
          },
          // Add custom CSS styles. Use !important to override default styles
          customCSS: `
            .chatbot-container {
              font-family: 'robotoregular' !important;
            }
            input, textarea {
              font-family: 'robotoregular' !important;
            }
          `,
        },

        // override theme configuration via deployment copilotConfig adaptions
        copilotConfig.theme
      ),

      // behavior configuration
      observersConfig: {
        // The bot message stack has changed
        observeMessages: (messages: ChatbotMessage[]) => {
          // Save the lastMessage for later processing (once loading is finished)
          lastMessage = messages[messages?.length - 1];
        },
        // The bot loading signal changed
        observeLoading: (loading: boolean) => {
          // Detect transition from true to false
          if (previousLoading && !loading) {
            // Ensure there is a message to process
            if (!lastMessage) {
              console.warn('No message available to process.');
              return;
            }

            // Check if the last message is an 'apiMessage' and ensure at least one usedTool exists
            if (lastMessage.type === 'apiMessage' && lastMessage.usedTools?.length > 0) {
              // Iterate over all used tools to handle multiple tool calls in one message
              lastMessage.usedTools.forEach(toolCall => this.handleToolCall(toolCall));
            }
          }

          // Update previousLoading for the next change
          previousLoading = loading;
        },
      },
    });
  }

  /**
   * Handle the selected tool call from the chatbot and trigger the corresponding action in the PWA.
   *
   * @param toolCall The chatbot tool call information
   */
  private handleToolCall(toolCall: ChatbotToolCall) {
    switch (toolCall?.tool) {
      case 'PWA_basket':
        this.handlePWABasketToolCall(toolCall.toolInput);
        break;
      case 'PWA_compare_products':
        // Note: this will only work if the 'compare' feature is enabled in the PWA
        this.compareFacade.compareProducts(toolCall.toolInput?.SKUs?.split(';'));
        this.navigate(`/compare`);
        break;
      case 'PWA_navigate_to_page':
        this.handlePWANavigateToPageToolCall(toolCall.toolInput);
        break;
      case 'PWA_order_template_actions':
        this.handlePWAOrderTemplateToolCall(toolCall.toolInput);
        break;
      case 'icmSearch':
        // Navigate to search results page based on icmSearch tool call
        this.handleIcmSearchToolCall(toolCall.toolOutput);
        break;
      default:
        break;
    }
  }

  /**
   * Make sure the navigation trigged by the Chatbot is executed within the Angular zone.
   *
   * @param url An absolute path for a defined route
   */
  private navigate(url: string) {
    this.ngZone.run(() => this.router.navigateByUrl(url));
  }

  /**
   * Retrieve color for copilot button from CSS custom properties or the theme color as fallback.
   */
  private getPrimaryColor(): string {
    return (
      getComputedStyle(document.documentElement).getPropertyValue('--color-copilot') ||
      getComputedStyle(document.documentElement).getPropertyValue('--corporate-primary') ||
      this.themeColor // fallback to the theme color defined in environment.ts
    );
  }

  /**
   * Triggers the corresponding basket action in the PWA based on the PWA_basket tool call from the copilot.
   * @param toolInput The copilot tool call input.
   */
  private handlePWABasketToolCall(toolInput: Record<string, string>) {
    const { operation, items } = toolInput || {};
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
   * Triggers the corresponding navigation route in the PWA based on the PWA_navigate_to_page tool call from the copilot.
   * @param toolInput The copilot tool call input information.
   */
  private handlePWANavigateToPageToolCall(toolInput: Record<string, string>) {
    const { page, sku, categoryId, orderId, orderTemplateId } = toolInput || {};

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
   * Triggers the corresponding order template action in the PWA based on the PWA_order_template_actions tool call from the copilot.
   * @param toolInput The copilot tool call input information.
   */

  private handlePWAOrderTemplateToolCall(toolInput: Record<string, string>) {
    const { operation, sku, orderTemplateId, title, quantity } = toolInput || {};

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

  /**
   * Processes the copilot's icmSearch tool call and triggers the corresponding search action in the PWA.
   * @param toolOutput - The copilot tool call output information
   * @param toolOutput.showOnPWA - Indicates if the search results should be displayed in the PWA
   * @param toolOutput.query - The search query executed by the copilot to be displayed in the PWA
   */
  private handleIcmSearchToolCall(toolOutput: string) {
    try {
      const parsed = JSON.parse(toolOutput);

      if (typeof parsed === 'object' && parsed?.showOnPWA !== undefined && parsed.query) {
        const query = parsed.query;

        if (query?.trim()) {
          this.navigate(`/search/${encodeURIComponent(query)}`);
        }
      }
    } catch {
      // intentionally ignore JSON parse errors
    }
  }
}
