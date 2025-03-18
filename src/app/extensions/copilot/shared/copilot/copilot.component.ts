import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { CompareFacade } from '../../../compare/facades/compare.facade';
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
    private compareFacade: CompareFacade
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
    localizations: { [key: string]: string },
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
              // Extract the last tool from the usedTools array to handle the according action
              this.handleToolCall(lastMessage.usedTools[lastMessage.usedTools.length - 1]);
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
      case 'product_search':
        if (toolCall.toolInput?.Query) {
          this.navigate(`/search/${toolCall.toolInput?.Query}`);
        } else if (toolCall.toolInput?.filter) {
          this.navigate(`/search/*?filters=${toolCall.toolInput?.filter}`);
        }
        break;
      case 'product_detail_page':
        this.navigate(`/product/${toolCall.toolInput?.SKU}`);
        break;
      case 'get_product_variations':
        this.navigate(`/product/${toolCall.toolInput?.SKU}`);
        break;
      case 'open_basket':
        this.navigate('/basket');
        break;
      case 'add_product_to_basket':
        this.shoppingFacade.addProductsToBasket(
          toolCall.toolInput?.Products?.split(';').map(sku => ({ sku, quantity: 1 }))
        );
        break;
      case 'compare_products':
        // Note: this will only work if the 'compare' feature is enabled in the PWA
        this.compareFacade.compareProducts(toolCall.toolInput?.SKUs?.split(';'));
        this.navigate(`/compare`);
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
   * Retrieve a set copilot color or the corporate primary color from CSS variables ('--primary' fallback to Bootstrap variable).
   */
  private getPrimaryColor(): string {
    return (
      getComputedStyle(document.documentElement).getPropertyValue('--color-copilot') ||
      getComputedStyle(document.documentElement).getPropertyValue('--corporate-primary') ||
      getComputedStyle(document.documentElement).getPropertyValue('--primary')
    );
  }
}
