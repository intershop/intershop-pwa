import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { OrderTemplatesFacade } from '../../order-templates/facades/order-templates.facade';
import { OrderTemplate } from '../../order-templates/models/order-template/order-template.model';
import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import { CopilotEmbeddedService } from '../services/copilot-embedded/copilot-embedded.service';
import { getCopilotEmbeddedConfig } from '../store/copilot-embedded-config/copilot-embedded-config.selectors';

import { CopilotEmbeddedToolCallFacade } from './copilot-embedded-tool-call.facade';
import { CopilotEmbeddedFacade } from './copilot-embedded.facade';

describe('Copilot Embedded Facade', () => {
  let facade: CopilotEmbeddedFacade;
  let copilotEmbeddedService: CopilotEmbeddedService;
  let featureToggleService: FeatureToggleService;

  function setup(config: CopilotEmbeddedConfig) {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getCopilotEmbeddedConfig, value: config }] })],
    });
    facade = TestBed.inject(CopilotEmbeddedFacade);
  }

  beforeEach(() => {
    const appFacade = mock(AppFacade);
    when(appFacade.getRestEndpointWithContext$).thenReturn(of('http://example.org/WFS/site/-;loc=en_US;cur=USD'));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    const apiTokenService = mock(ApiTokenService);
    when(apiTokenService.apiToken$).thenReturn(new BehaviorSubject<string>('icm-token-xyz'));

    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basketLineItems$).thenReturn(
      of([{ productSKU: '123', quantity: { value: 2 } }] as LineItemView[])
    );

    const orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.orderTemplates$).thenReturn(of([{ id: 'ot-1', title: 'Office' }] as OrderTemplate[]));

    featureToggleService = mock(FeatureToggleService);
    when(featureToggleService.enabled$(anything())).thenReturn(of(true));

    copilotEmbeddedService = mock(CopilotEmbeddedService);
    when(copilotEmbeddedService.sendMessage(anything(), anything())).thenReturn(
      of({ text: 'ok', usedTools: [], products: [] })
    );
    when(copilotEmbeddedService.isStreamingAvailable$(anything())).thenReturn(of(true));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CopilotEmbeddedService, useFactory: () => instance(copilotEmbeddedService) },
        { provide: CopilotEmbeddedToolCallFacade, useFactory: () => instance(mock(CopilotEmbeddedToolCallFacade)) },
        { provide: FeatureToggleService, useFactory: () => instance(featureToggleService) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
      ],
    });
  });

  it('should enrich the request with the PWA context and chatflow variables', done => {
    const config = { apiHost: 'https://flowise.example.com', chatflowid: 'flow-1', chatflowConfig: { vars: { a: 1 } } };
    setup(config);

    facade
      .sendMessage('hi', { sessionId: 'session-1', shownProducts: [{ sku: '456' }], vars: { b: 2 } })
      .subscribe(() => {
        const [sentConfig, request] = capture(copilotEmbeddedService.sendMessage).last();
        expect(sentConfig).toEqual(config);
        expect(request).toEqual({
          question: 'hi',
          sessionId: 'session-1',
          chatId: undefined,
          uploads: undefined,
          vars: {
            restEndpoint: 'http://example.org/WFS/site/-;loc=en_US;cur=USD',
            currentLocale: 'en_US',
            user_token: 'icm-token-xyz',
            a: 1,
            b: 2,
          },
          basket: [{ sku: '123', quantity: 2 }],
          orderTemplates: [{ id: 'ot-1', title: 'Office' }],
          shownProducts: [{ sku: '456' }],
        });
        done();
      });
  });

  it('should not read order templates when the feature is disabled', done => {
    when(featureToggleService.enabled$(anything())).thenReturn(of(false));
    setup({ apiHost: 'https://flowise.example.com', chatflowid: 'flow-1' });

    facade.sendMessage('hi').subscribe(() => {
      expect(capture(copilotEmbeddedService.sendMessage).last()[1].orderTemplates).toBeEmpty();
      done();
    });
  });

  it('should honor the streaming configuration without probing the chatflow', done => {
    setup({ apiHost: 'https://flowise.example.com', chatflowid: 'flow-1', streaming: false });

    facade.isStreamingAvailable$().subscribe(streaming => {
      expect(streaming).toBeFalse();
      verify(copilotEmbeddedService.isStreamingAvailable$(anything())).never();
      done();
    });
  });

  it('should probe the chatflow when streaming is not configured', done => {
    setup({ apiHost: 'https://flowise.example.com', chatflowid: 'flow-1' });

    facade.isStreamingAvailable$().subscribe(streaming => {
      expect(streaming).toBeTrue();
      verify(copilotEmbeddedService.isStreamingAvailable$(anything())).once();
      done();
    });
  });
});
