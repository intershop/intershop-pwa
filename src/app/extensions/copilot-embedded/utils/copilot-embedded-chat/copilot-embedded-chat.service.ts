import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../../order-templates/facades/order-templates.facade';
import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { CopilotEmbeddedAnswer } from '../../models/copilot-embedded-answer/copilot-embedded-answer.model';
import {
  CopilotEmbeddedRequest,
  CopilotEmbeddedRequestOptions,
} from '../../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedService } from '../../services/copilot-embedded/copilot-embedded.service';

/**
 * Sends chat messages to the Copilot Embedded chatflow and enriches every request with the current PWA context
 * (chatflow variables, basket, order templates and shown products), see the Copilot Embedded guide.
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
   *
   * @returns           Emits once whether the answers are streamed.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.copilotEmbeddedFacade.configuration$.pipe(
      whenTruthy(),
      take(1),
      switchMap(config =>
        typeof config.streaming === 'boolean'
          ? of(config.streaming)
          : this.copilotEmbeddedService.isStreamingAvailable$()
      )
    );
  }

  /**
   * Sends a message to the Copilot Embedded and returns the complete answer.
   *
   * @param question    The user's question; may be empty if an image is attached via `options.uploads`.
   * @param options     Session, chat instance, attachments, shown products and additional chatflow variables of the request.
   * @returns           Emits the complete answer once; errors if the request fails.
   */
  sendMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedAnswer> {
    return this.chatRequest$(question, options).pipe(
      switchMap(request => this.copilotEmbeddedService.sendMessage(request))
    );
  }

  /**
   * Sends a message to the Copilot Embedded and emits the answer received so far as it is generated.
   *
   * @param question    The user's question; may be empty if an image is attached via `options.uploads`.
   * @param options     Session, chat instance, attachments, shown products and additional chatflow variables of the request.
   * @returns           Emits the answer received so far on every change and completes with the stream; errors if the request fails.
   */
  streamMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedAnswer> {
    return this.chatRequest$(question, options).pipe(
      switchMap(request => this.copilotEmbeddedService.streamMessage(request))
    );
  }

  private chatRequest$(question: string, options: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedRequest> {
    return combineLatest([
      this.copilotEmbeddedFacade.configuration$.pipe(whenTruthy()),
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
      map(([config, restEndpoint, currentLocale, userToken, lineItems, orderTemplates]): CopilotEmbeddedRequest => ({
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
      }))
    );
  }
}
