import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ProductAdvisorConfig } from '../../models/product-advisor-config/product-advisor-config.model';
import { ProductAdvisorResponse } from '../../models/product-advisor/product-advisor.model';

import { ProductAdvisorService } from './product-advisor.service';

const productAdvisorConfig: ProductAdvisorConfig = {
  apiHost: 'https://flowise.example.com',
  chatflowid: 'chatflow-123',
};

const predictionUrl = 'https://flowise.example.com/api/v1/prediction/chatflow-123';

// testing here is handled by http testing controller

describe('Product Advisor Service', () => {
  let productAdvisorService: ProductAdvisorService;
  let httpTestingController: HttpTestingController;
  let statePropertiesService: StatePropertiesService;

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);
    when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(of(productAdvisorConfig));

    const appFacade = mock(AppFacade);
    when(appFacade.getRestEndpointWithContext$).thenReturn(of('http://example.org/WFS/site/-;loc=en_US;cur=USD'));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    const apiTokenService = mock(ApiTokenService);
    when(apiTokenService.apiToken$).thenReturn(new BehaviorSubject<string>('icm-token-xyz'));

    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basketLineItems$).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    productAdvisorService = TestBed.inject(ProductAdvisorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(productAdvisorService).toBeTruthy();
  });

  it('should throw when sending a message without a question', () => {
    expect(() => productAdvisorService.sendMessage('')).toThrow();
    expect(() => productAdvisorService.sendMessage('   ')).toThrow();
  });

  it('should post the question to the Flowise prediction endpoint', done => {
    const response: ProductAdvisorResponse = { text: 'Here is a recommendation', chatId: 'abc' };

    productAdvisorService.sendMessage('recommend a laptop', { sessionId: 'session-1' }).subscribe(result => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpTestingController.expectOne(predictionUrl);
    expect(req.request.method).toEqual('POST');
    // the current basket is appended to the question as a [CURRENT_BASKET] marker
    expect(req.request.body.question).toEqual('recommend a laptop\n\n[CURRENT_BASKET]=[]');
    expect(req.request.body.overrideConfig.sessionId).toEqual('session-1');
    expect(req.request.body.overrideConfig.vars.currentLocale).toEqual('en_US');
    expect(req.request.body.overrideConfig.vars.restEndpoint).toEqual(
      'http://example.org/WFS/site/-;loc=en_US;cur=USD'
    );
    req.flush(response);
  });

  it('should merge additional request vars into the chatflow variables', done => {
    productAdvisorService.sendMessage('hi', { vars: { foo: 'bar' } }).subscribe(() => done());

    const req = httpTestingController.expectOne(predictionUrl);
    expect(req.request.body.overrideConfig.vars.foo).toEqual('bar');
    req.flush({ text: 'ok' });
  });

  it('should forward the ICM access token as the user_token variable', done => {
    productAdvisorService.sendMessage('hi').subscribe(() => done());

    const req = httpTestingController.expectOne(predictionUrl);
    expect(req.request.body.overrideConfig.vars.user_token).toEqual('icm-token-xyz');
    req.flush({ text: 'ok' });
  });

  it('should probe whether the chatflow supports streaming', done => {
    productAdvisorService.isStreamingAvailable$().subscribe(available => {
      expect(available).toBeTrue();
      done();
    });

    const req = httpTestingController.expectOne('https://flowise.example.com/api/v1/chatflows-streaming/chatflow-123');
    expect(req.request.method).toEqual('GET');
    req.flush({ isStreaming: true });
  });
});
