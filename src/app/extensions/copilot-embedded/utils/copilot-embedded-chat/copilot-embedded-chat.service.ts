import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { OrderTemplatesFacade } from '../../../order-templates/facades/order-templates.facade';
import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { CopilotEmbeddedAnswer } from '../../models/copilot-embedded-answer/copilot-embedded-answer.model';
import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';
import {
  CopilotEmbeddedChatRequest,
  CopilotEmbeddedRequestOptions,
} from '../../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedService } from '../../services/copilot-embedded/copilot-embedded.service';

/**
 * Sends chat messages to the Copilot Embedded chatflow and enriches every request with the current
 * PWA context.
 *
 * The `restEndpoint`, `currentLocale` and - for logged-in users - the ICM `user_token` are provided
 * as chatflow variables on every request (mirroring the Copilot integration) so the chatflow can
 * call back into ICM as the current user.
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedChatService {
  constructor(
    private copilotEmbeddedFacade: CopilotEmbeddedFacade,
    private appFacade: AppFacade,
    private apiTokenService: ApiTokenService,
    private checkoutFacade: CheckoutFacade,
    private orderTemplatesFacade: OrderTemplatesFacade,
    private featureToggleService: FeatureToggleService,
    private copilotEmbeddedService: CopilotEmbeddedService
  ) {}

  /**
   * Whether to stream the responses: honors the `streaming` configuration, otherwise probes the chatflow.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.copilotEmbeddedFacade.configuration$.pipe(
      take(1),
      switchMap(config =>
        typeof config.streaming === 'boolean'
          ? of(config.streaming)
          : this.copilotEmbeddedService.isStreamingAvailable$(config)
      )
    );
  }

  /**
   * Sends a message to the Copilot Embedded and returns the complete answer.
   */
  sendMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedAnswer> {
    return this.chatRequest$(question, options).pipe(
      switchMap(([config, request]) => this.copilotEmbeddedService.sendMessage(config, request))
    );
  }

  /**
   * Sends a message to the Copilot Embedded and emits the answer received so far as it is generated.
   */
  streamMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedAnswer> {
    return this.chatRequest$(question, options).pipe(
      switchMap(([config, request]) => this.copilotEmbeddedService.streamMessage(config, request))
    );
  }

  private chatRequest$(
    question: string,
    options: CopilotEmbeddedRequestOptions | undefined
  ): Observable<[CopilotEmbeddedConfig, CopilotEmbeddedChatRequest]> {
    return combineLatest([
      this.copilotEmbeddedFacade.configuration$,
      this.appFacade.getRestEndpointWithContext$,
      this.appFacade.currentLocale$,
      this.apiTokenService.apiToken$,
      this.checkoutFacade.basketLineItems$,
      // order templates are a lazy, feature-gated store; only read them when the feature is enabled
      this.featureToggleService
        .enabled$('orderTemplates')
        .pipe(switchMap(enabled => (enabled ? this.orderTemplatesFacade.orderTemplates$ : of([])))),
    ]).pipe(
      take(1),
      map(
        ([config, restEndpoint, currentLocale, userToken, lineItems, orderTemplates]): [
          CopilotEmbeddedConfig,
          CopilotEmbeddedChatRequest,
        ] => [
          config,
          {
            question,
            sessionId: options?.sessionId,
            chatId: options?.chatId,
            uploads: options?.uploads,
            vars: {
              restEndpoint,
              currentLocale,
              ...(userToken ? { user_token: userToken } : {}),
              ...config.chatflowConfig?.vars,
              ...options?.vars,
            },
            basket: (lineItems ?? []).map(li => ({ sku: li.productSKU, quantity: li.quantity?.value })),
            orderTemplates: (orderTemplates ?? []).map(t => ({ id: t.id, title: t.title })),
            shownProducts: options?.shownProducts ?? [],
          },
        ]
      )
    );
  }
}
