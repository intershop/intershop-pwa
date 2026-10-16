import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../order-templates/facades/order-templates.facade';
import {
  CopilotEmbeddedAnswerData,
  CopilotEmbeddedStreamEvent,
} from '../models/copilot-embedded-answer/copilot-embedded-answer.interface';
import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import {
  CopilotEmbeddedChatRequest,
  CopilotEmbeddedRequestOptions,
} from '../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedToolCall } from '../models/copilot-embedded-tool-call/copilot-embedded-tool-call.model';
import { CopilotEmbeddedService } from '../services/copilot-embedded/copilot-embedded.service';
import { getCopilotEmbeddedConfig } from '../store/copilot-embedded-config/copilot-embedded-config.selectors';

import { CopilotEmbeddedToolCallFacade } from './copilot-embedded-tool-call.facade';

/**
 * Facade for the Copilot Embedded AI agent. Provides the configuration and enriches every chat
 * request with the current PWA context before it is sent to the Flowise chatflow.
 *
 * The `restEndpoint`, `currentLocale` and - for logged-in users - the ICM `user_token` are provided
 * as chatflow variables on every request (mirroring the Copilot integration) so the chatflow can
 * call back into ICM as the current user.
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedFacade {
  constructor(
    private store: Store,
    private appFacade: AppFacade,
    private apiTokenService: ApiTokenService,
    private checkoutFacade: CheckoutFacade,
    private orderTemplatesFacade: OrderTemplatesFacade,
    private featureToggleService: FeatureToggleService,
    private copilotEmbeddedService: CopilotEmbeddedService,
    private copilotEmbeddedToolCallFacade: CopilotEmbeddedToolCallFacade
  ) {}

  /**
   * The Copilot Embedded configuration (server state, environment variable or `environment.ts`).
   * Emits once the lazily loaded store slice holds the configuration.
   */
  configuration$: Observable<CopilotEmbeddedConfig> = this.store.pipe(select(getCopilotEmbeddedConfig), whenTruthy());

  /**
   * Whether to stream the responses: honors the `streaming` configuration, otherwise probes the chatflow.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.configuration$.pipe(
      take(1),
      switchMap(config =>
        typeof config.streaming === 'boolean'
          ? of(config.streaming)
          : this.copilotEmbeddedService.isStreamingAvailable$(config)
      )
    );
  }

  /**
   * Sends a message to the Copilot Embedded and returns the complete response.
   */
  sendMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedAnswerData> {
    return this.chatRequest$(question, options).pipe(
      switchMap(([config, request]) => this.copilotEmbeddedService.sendMessage(config, request))
    );
  }

  /**
   * Sends a message to the Copilot Embedded and streams the response as it is generated.
   */
  streamMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedStreamEvent> {
    return this.chatRequest$(question, options).pipe(
      switchMap(([config, request]) => this.copilotEmbeddedService.streamMessage(config, request))
    );
  }

  /**
   * Executes the action tool calls (basket, compare, navigation, order templates) of a response.
   */
  handleToolCalls(toolCalls: CopilotEmbeddedToolCall[] | undefined): void {
    this.copilotEmbeddedToolCallFacade.handleToolCalls(toolCalls);
  }

  private chatRequest$(
    question: string,
    options: CopilotEmbeddedRequestOptions | undefined
  ): Observable<[CopilotEmbeddedConfig, CopilotEmbeddedChatRequest]> {
    return combineLatest([
      this.configuration$,
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
