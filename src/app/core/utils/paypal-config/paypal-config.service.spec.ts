import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { PaypalConfigService } from './paypal-config.service';

describe('Paypal Config Service', () => {
  let helper: PaypalConfigService;
  let appFacadeMock: AppFacade;

  beforeEach(() => {
    appFacadeMock = mock(AppFacade);

    TestBed.configureTestingModule({
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacadeMock) }],
    });

    helper = TestBed.inject(PaypalConfigService);
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  describe('loadPayPalScript', () => {
    it('should be a function', () => {
      expect(typeof helper.loadPayPalScript).toBe('function');
    });
  });
});
